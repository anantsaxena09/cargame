"use client";

import { Canvas } from "@react-three/fiber";
import { OrthographicCamera } from "@react-three/drei";
import { Physics } from "@react-three/rapier";
import Vehicle from "./components/Vehicle";
import FallingShapes from "./components/FallingShapes";

const Page = () => {
  return (
    <Canvas
      style={{ height: "100vh", width: "100vw" }}
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 10]} intensity={1} />

      <OrthographicCamera 
        makeDefault 
        position={[0, 10, 0]} 
        zoom={60}
        rotation={[-Math.PI / 2, 0, 0]}
        near={0.1} 
        far={100} 
      />
      
      <Physics>
        <Vehicle />
        <FallingShapes /> 
      </Physics>
    </Canvas>
  );
};

export default Page;
