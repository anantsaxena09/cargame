"use client";

import { useRef, useEffect, useState } from "react";
import { RigidBody } from "@react-three/rapier";
import { Sphere, Cylinder, Box } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";

const Vehicle = () => {
  const vehicleRef = useRef();
  const { camera } = useThree();
  const [cursor, setCursor] = useState(new THREE.Vector2());
  const [isMovingForward, setIsMovingForward] = useState(false);
  const [isMovingBackward, setIsMovingBackward] = useState(false);

  useEffect(() => {
    const handlePointerMove = (event) => {
      const mouse = new THREE.Vector2();
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
      setCursor(mouse);
    };

    const handleKeyDown = (event) => {
      if (event.key === "w" || event.key === "W") setIsMovingForward(true);
      if (event.key === "s" || event.key === "S") setIsMovingBackward(true);
    };

    const handleKeyUp = (event) => {
      if (event.key === "w" || event.key === "W") setIsMovingForward(false);
      if (event.key === "s" || event.key === "S") setIsMovingBackward(false);
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  useEffect(() => {
    if (vehicleRef.current) {
      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(cursor, camera);

      const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
      const intersectPoint = new THREE.Vector3();
      raycaster.ray.intersectPlane(plane, intersectPoint);

      const direction = new THREE.Vector3().subVectors(intersectPoint, vehicleRef.current.position).normalize();

      const movementSpeed = 0.09;

      if (isMovingForward) {
        vehicleRef.current.position.x += direction.x * movementSpeed;
        vehicleRef.current.position.z += direction.z * movementSpeed;
      }

      if (isMovingBackward) {
        vehicleRef.current.position.x -= direction.x * movementSpeed;
        vehicleRef.current.position.z -= direction.z * movementSpeed;
      }

      const targetAngle = Math.atan2(direction.x, direction.z);
      const currentAngle = vehicleRef.current.rotation.y;

      let deltaAngle = targetAngle - currentAngle;
      if (deltaAngle > Math.PI) deltaAngle -= 2 * Math.PI;
      if (deltaAngle < -Math.PI) deltaAngle += 2 * Math.PI;

      const rotationSpeed = 0.1; 
      vehicleRef.current.rotation.y += Math.sign(deltaAngle) * Math.min(Math.abs(deltaAngle), rotationSpeed);
    }
  }, [cursor, camera, isMovingForward, isMovingBackward]);
  
  return (
    <group ref={vehicleRef} rotation={[0, Math.PI, 0]} scale={[0.8, 0.8, 0.8]}>
      {/* Front Wheel */}
      <RigidBody type="kinematicPosition" lockRotations lockTranslations={[false, true, false]}>
        <Sphere args={[0.5]} position={[0, 0.5, 1]}>
          <meshStandardMaterial color="red" />
        </Sphere>
      </RigidBody>

      {/* Back Wheels */}
      <RigidBody type="kinematicPosition" lockRotations lockTranslations={[false, true, false]}>
        <Cylinder args={[0.3, 0.3, 0.5]} position={[-0.8, 0.3, -1]} rotation={[Math.PI / 2, 0, 0]}>
          <meshStandardMaterial color="white" />
        </Cylinder>
        <Cylinder args={[0.3, 0.3, 0.5]} position={[0.8, 0.3, -1]} rotation={[Math.PI / 2, 0, 0]}>
          <meshStandardMaterial color="white" />
        </Cylinder>
      </RigidBody>

      {/* Vehicle Body */}
      <RigidBody type="kinematicPosition" lockRotations lockTranslations={[false, true, false]}>
        <Box args={[2, 0.5, 2]} position={[0, 0.5, 0]}>
          <meshStandardMaterial color="blue" />
        </Box>
      </RigidBody>
    </group>
  );
};

export default Vehicle;
