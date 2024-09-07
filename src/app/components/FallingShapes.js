"use client";

import { useRef, useEffect, useState } from "react";
import { Box, Sphere, Cone } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";

const createRandomShape = () => {
  const shapes = ["sphere", "box", "cone"];
  const shapeType = shapes[Math.floor(Math.random() * shapes.length)];
  const shapeSize = Math.random() * 1 + 0.5; 
  const positionX = Math.random() * 12 - 6; 
  const positionZ = -10; 

  return { shapeType, shapeSize, positionX, positionZ };
};

const FallingShapes = () => {
  const [shapes, setShapes] = useState([]);
  const [positions, setPositions] = useState(new Set());


  const addRandomShape = () => {
    let positionX;

    do {
      positionX = Math.random() * 12 - 6; 
    } while (Array.from(positions).some(pos => Math.abs(pos - positionX) < 1)); 

    setPositions(prev => new Set([...prev, positionX]));

    setShapes(prevShapes => [...prevShapes, { shapeType: createRandomShape().shapeType, shapeSize: createRandomShape().shapeSize, positionX, positionZ: -10 }]);
  };
  
  useEffect(() => {
    const interval = setInterval(() => {
      addRandomShape();
    }, Math.random() * 2000 + 500); 

    return () => clearInterval(interval);
  }, []);

  useFrame(() => {
    setShapes(prevShapes =>
      prevShapes
        .map(shape => ({
          ...shape,
          positionZ: shape.positionZ + 0.1, 
        }))
        .filter(shape => shape.positionZ <= 10) 
    );
  });

  return (
    <>
      {shapes.map((shape, index) => (
        <group key={index} position={[shape.positionX, 1, shape.positionZ]}>
          {shape.shapeType === "sphere" && (
            <Sphere args={[shape.shapeSize]}>
              <meshStandardMaterial color="blue" />
            </Sphere>
          )}
          {shape.shapeType === "box" && (
            <Box args={[shape.shapeSize, shape.shapeSize, shape.shapeSize]}>
              <meshStandardMaterial color="green" />
            </Box>
          )}
          {shape.shapeType === "cone" && (
            <Cone args={[shape.shapeSize, shape.shapeSize * 2, 8]}>
              <meshStandardMaterial color="red" />
            </Cone>
          )}
        </group>
      ))}
    </>
  );
};

export default FallingShapes;
