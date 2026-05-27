"use client";

import React, { useEffect, useMemo } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { SparkRenderer, SplatMesh, SplatFileType } from "@sparkjsdev/spark";
import * as THREE from "three";

// --- 내부: 카메라 컨트롤러 ---
interface CameraControllerProps {
  zoomValue: number;
  rotationDeg: number;
}

function CameraController({ zoomValue, rotationDeg }: CameraControllerProps) {
  const { camera } = useThree();

  useEffect(() => {
    // 1. 카메라의 위쪽 방향을 표준 Y축으로 고정합니다.
    camera.up.set(0, 1, 0);

    // 2. 줌 슬라이더(0~1)를 전신이 충분히 다 보일 수 있는 반경(Radius)으로 조절합니다. (1.5 ~ 4.5 범위)
    const minRadius = 1.5;
    const maxRadius = 8.0;
    const r = maxRadius - zoomValue * (maxRadius - minRadius);

    // 3. 사람 모델이 배치된 실제 월드 좌표와 상체 높이를 기준으로 타겟 회전축을 잡습니다.
    // 메쉬 position이 [0.2, -0.6, 0]이므로 회전축 수평 좌표는 X=0.2, Z=0입니다.
    // 세로(Y) 높이는 사람 상체의 중심인 Y = -1.0 근처로 설정합니다.
    const tx = 0.2;
    const ty = -1.5;
    const tz = -0.6;

    // 4. 시작 시 정면(180도 회전된 방향)을 보여주기 위해 180도 오프셋을 추가하여 라디안으로 변환합니다.
    const rad = ((rotationDeg + 180) * Math.PI) / 180;

    // 5. 카메라 위치를 타겟 좌표(tx, tz) 기준의 궤도 반경으로 설정합니다.
    camera.position.x = tx + r * Math.sin(rad);
    camera.position.y = ty;
    camera.position.z = tz + r * Math.cos(rad);

    // 6. 카메라가 정확히 타겟 회전축을 바라보도록 고정합니다.
    camera.lookAt(tx, ty, tz);
    camera.updateProjectionMatrix();
  }, [zoomValue, rotationDeg, camera]);

  return null;
}

// --- 내부: Spark 씬 컴포넌트 ---
interface SpzSceneProps {
  url: string;
  zoomValue: number;
  rotationDeg: number;
  onLoad?: () => void;
  onError?: (err: any) => void;
}

function SpzScene({ url, zoomValue, rotationDeg, onLoad, onError }: SpzSceneProps) {
  const { gl } = useThree();

  // SparkRenderer 인스턴스 캐싱
  const spark = useMemo(() => new SparkRenderer({ renderer: gl }), [gl]);

  // SplatMesh 인스턴스 캐싱
  const splatMesh = useMemo(() => new SplatMesh(), []);

  // 비동기 fetch 및 파일 타입별 자동 초기화
  useEffect(() => {
    let active = true;

    const loadSplat = async () => {
      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const arrayBuffer = await response.arrayBuffer();

        if (!active) return;

        const bytes = new Uint8Array(arrayBuffer);
        const isGzipped = bytes[0] === 0x1f && bytes[1] === 0x8b;

        // 확장자별 포맷 구분
        const extension = url.split(".").pop()?.toLowerCase();
        let detectedFileType = SplatFileType.SPLAT; // 기본값

        if (isGzipped || extension === "spz") {
          detectedFileType = SplatFileType.SPZ;
        } else if (extension === "ply") {
          detectedFileType = SplatFileType.PLY;
        }

        console.log(`[Spark Loader] URL: ${url}, Ext: ${extension}, Type: ${detectedFileType}, size: ${bytes.length} bytes`);

        await splatMesh.asyncInitialize({
          fileBytes: arrayBuffer,
          fileType: detectedFileType,
          fileName: url.split("/").pop() || "model.splat"
        });

        if (active) {
          // 로드된 3D 모델의 실제 Bounding Box 크기와 중심점 로그 출력
          const bbox = splatMesh.getBoundingBox();
          const center = new THREE.Vector3();
          bbox.getCenter(center);
          const size = new THREE.Vector3();
          bbox.getSize(size);
          console.log(`[Spark Loader BBox] Center: [${center.x.toFixed(2)}, ${center.y.toFixed(2)}, ${center.z.toFixed(2)}], Size: [${size.x.toFixed(2)}, ${size.y.toFixed(2)}, ${size.z.toFixed(2)}]`);

          if (onLoad) onLoad();
        }
      } catch (err) {
        console.error("[Spark SplatMesh load error]", err);
        if (active && onError) {
          onError(err);
        }
      }
    };

    loadSplat();

    return () => {
      active = false;
    };
  }, [url, splatMesh, onLoad, onError]);

  // 컴포넌트 unmount 시 메모리 해제
  useEffect(() => {
    return () => {
      splatMesh.dispose();
      spark.dispose();
    };
  }, [splatMesh, spark]);

  return (
    <>
      {/* 핵심 렌더러와 메쉬 인스턴스를 Scene에 바인딩합니다 */}
      <primitive object={spark} />

      {/* 🚨 지오메트리 최종 교정 태그 */}
      <primitive
        object={splatMesh}
        // 1. Z-up 원본 PLY 데이터를 똑바로 세우고(X축 180도), 사용자 정면을 바라보게(Y축 180도) 회전합니다.
        rotation={[Math.PI, Math.PI, 0]}

        // 2. 사람이 화면 중앙에서 벗어나 부자연스럽게 회전하던 좌표 오차를 보정합니다.
        // 사람이 왼쪽에 치우쳤으므로 X축을 오른쪽으로 이동(+0.2), 
        // 다리가 잘렸으므로 Y축을 아래로 이동(-0.6)시킵니다.
        // position={[X-shift, Y-shift, Z-shift]}
        position={[0.2, -0.6, 0]}

      // 3. 만약 사람이 너무 크다면 스케일을 조절하세요.
      // scale={[0.5, 0.5, 0.5]} 
      />

      <CameraController zoomValue={zoomValue} rotationDeg={rotationDeg} />
    </>
  );
}

// --- 공개: SPZ/PLY 뷰어 카드 컴포넌트 ---
interface SpzViewerProps {
  url: string;
  zoomValue: number;
  rotationDeg: number;
  onLoad?: () => void;
  onError?: (err: any) => void;
  height?: number;
}

export default function SpzViewer({
  url,
  zoomValue,
  rotationDeg,
  onLoad,
  onError,
  height = 380,
}: SpzViewerProps) {
  return (
    <div style={{ width: "100%", height: `${height}px`, background: "#0a0a0a", position: "relative" }}>
      <Canvas
        // 카메라의 초기 위치를 사람 중앙 높이인 Y=1로 변경합니다.
        camera={{ position: [0, 1, 5], fov: 60, near: 0.01, far: 1000 }}
        style={{ width: "100%", height: "100%" }}
        gl={{ antialias: false, alpha: false }}
      >
        <ambientLight intensity={0.5} />
        <SpzScene
          url={url}
          zoomValue={zoomValue}
          rotationDeg={rotationDeg}
          onLoad={onLoad}
          onError={onError}
        />
      </Canvas>
    </div>
  );
}