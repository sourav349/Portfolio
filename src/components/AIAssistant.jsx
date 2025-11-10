// AIAssistant.jsx
import React, { useRef, useState } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Html, OrbitControls } from "@react-three/drei";
// import * as THREE from "three";

/* =========================
   Styled UI (chat + container)
   ========================= */
const AssistantContainer = styled.div`
  position: fixed;
  bottom: 36px;
  right: 36px;
  width: 260px;
  height: 260px;
  z-index: 9999;
  pointer-events: auto;
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
`;

const BubbleText = styled(motion.div)`
  position: absolute;
  bottom: 145px; /* aligned perfectly near the bot */
  right: 160px; /* nicely close to the assistant */
  background: linear-gradient(135deg, #ff5fa3, #854ce6);
  color: #fff;
  padding: 10px 16px;
  border-radius: 10px 14px 14px 2px; /* 👈 sharper tail-like edge */
  font-size: 14px;
  font-weight: 600;
  box-shadow: 0 8px 25px rgba(133, 76, 230, 0.4);
  white-space: nowrap;
  pointer-events: none;
  border: 1px solid rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(6px);
  transform: perspective(300px) rotateY(-5deg); /* slight 3D twist */
  transition: all 0.3s ease;

  &:after {
    content: "";
    position: absolute;
    bottom: 8px;
    right: -6px;
    width: 10px;
    height: 10px;
    background: linear-gradient(135deg, #854ce6, #ff5fa3);
    transform: rotate(45deg);
    border-radius: 2px; /* sharp tail corner */
    box-shadow: 0 0 10px rgba(255, 95, 163, 0.6);
  }
`;

/* (Everything else remains the same below) */

const ChatPanel = styled(motion.div)`
  position: absolute;
  bottom: 280px;
  right: 0;
  width: 320px;
  max-width: calc(100vw - 48px);
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.02),
    rgba(255, 255, 255, 0.01)
  );
  backdrop-filter: blur(8px);
  border-radius: 14px;
  padding: 14px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.6);
  color: #fff;
  font-family: Inter, system-ui, sans-serif;
  overflow: hidden;
`;

const ChatHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
`;

const BotName = styled.div`
  font-weight: 700;
  font-size: 16px;
`;

const ChatBody = styled.div`
  font-size: 14px;
  color: #e6e6e6;
  margin-bottom: 10px;
  line-height: 1.3;
`;

const InputRow = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const TextInput = styled.input`
  flex: 1;
  padding: 8px 10px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.04);
  color: #fff;
  outline: none;
  font-size: 14px;
`;

const MailBtn = styled.button`
  padding: 8px 10px;
  border-radius: 10px;
  background: linear-gradient(135deg, #00fff0, #854ce6);
  color: #081827;
  font-weight: 700;
  border: none;
  cursor: pointer;
`;

/* =========================
   3D Bot (Three fiber)
   ========================= */
function Visor({ position = [0, 0.5, 0.6] }) {
  return (
    <mesh position={position}>
      <sphereGeometry args={[0.42, 48, 48]} />
      <meshStandardMaterial
        color={"#06061a"}
        metalness={0.2}
        roughness={0.1}
        emissive={"#0a1228"}
        emissiveIntensity={0.7}
      />
    </mesh>
  );
}

function BodyPiece({
  args = [0.66, 48, 48],
  position = [0, -0.7, 0],
  color = "#c2f6ff",
  emissive,
}) {
  return (
    <mesh position={position} castShadow receiveShadow>
      <sphereGeometry args={args} />
      <meshStandardMaterial
        color={color}
        metalness={0.2}
        roughness={0.45}
        emissive={emissive || "#000000"}
        emissiveIntensity={0.5}
      />
    </mesh>
  );
}

function FloatingBot({ clicked, setClicked, handGesture }) {
  const root = useRef();
  const leftHand = useRef();
  const rightHand = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (root.current) {
      root.current.position.y = Math.sin(t * 1.2) * 0.06;
      root.current.rotation.y = Math.sin(t / 4) * 0.08;
    }

    if (leftHand.current) {
      leftHand.current.rotation.z =
        Math.sin(t * 2.4) * 0.35 + (handGesture ? Math.sin(t * 10) * 0.6 : 0);
      leftHand.current.position.x =
        0.85 + Math.sin(t * 1.5) * 0.02 + (handGesture ? 0.02 : 0);
    }
    if (rightHand.current) {
      rightHand.current.rotation.z = -Math.sin(t * 1.8) * 0.22;
      rightHand.current.position.x = -0.85 + Math.cos(t * 1.2) * 0.02;
    }
  });

  return (
    <Float floatIntensity={0.6} rotationIntensity={0.8} speed={1.2}>
      <group ref={root} scale={0.64}>
        <mesh position={[0, 0.5, 0]}>
          <sphereGeometry args={[0.82, 64, 64]} />
          <meshStandardMaterial
            color={"#dff9ff"}
            metalness={0.15}
            roughness={0.35}
            emissive={"#0b3b44"}
            emissiveIntensity={0.06}
          />
        </mesh>
        <Visor />
        <BodyPiece
          position={[0, -0.2, 0]}
          args={[0.68, 64, 64]}
          color={"#e9feff"}
          emissive={"#0f2430"}
        />
        <group ref={leftHand} position={[0.9, -0.25, 0]}>
          <mesh>
            <sphereGeometry args={[0.23, 32, 32]} />
            <meshStandardMaterial
              color={"#00f0f0"}
              emissive={"#00f0f0"}
              emissiveIntensity={0.9}
              metalness={0.25}
              roughness={0.2}
            />
          </mesh>
        </group>
        <group ref={rightHand} position={[-0.9, -0.25, 0]}>
          <mesh>
            <sphereGeometry args={[0.23, 32, 32]} />
            <meshStandardMaterial
              color={"#854ce6"}
              emissive={"#854ce6"}
              emissiveIntensity={0.9}
              metalness={0.25}
              roughness={0.2}
            />
          </mesh>
        </group>
        <mesh position={[0, -0.18, 0.48]} rotation={[0, 0, 0]}>
          <circleGeometry args={[0.14, 32]} />
          <meshStandardMaterial
            color={"#0b1636"}
            emissive={"#b16ef6"}
            emissiveIntensity={0.7}
          />
        </mesh>
      </group>
    </Float>
  );
}

/* =========================
   Main exported component
   ========================= */
export default function AIAssistant() {
  const [open, setOpen] = useState(false);
  const [handGesture, setHandGesture] = useState(false);
  const [question, setQuestion] = useState("");

  function handleAssistantClick() {
    setHandGesture(true);
    setTimeout(() => setHandGesture(false), 900);
    setOpen((s) => !s);
  }

  function handleMail() {
    const body = encodeURIComponent(
      `${question}\n\n— Sent by Sourav's AI Assistant`
    );
    window.location.href = `mailto:someone@example.com?subject=Question from Sourav&body=${body}`;
  }

  return (
    <AssistantContainer>
      {/* floating "Hi!" bubble */}
      <BubbleText
        initial={{ opacity: 0, y: 10, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{
          duration: 0.7,
          delay: 0.2,
          type: "spring",
          stiffness: 120,
        }}
      >
        Hi!
      </BubbleText>

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <ChatPanel
            initial={{ opacity: 0, translateY: 10, scale: 0.98 }}
            animate={{ opacity: 1, translateY: 0, scale: 1 }}
            exit={{ opacity: 0, translateY: 10, scale: 0.98 }}
            transition={{ duration: 0.25 }}
          >
            <ChatHeader>
              <svg
                width="36"
                height="36"
                viewBox="0 0 24 24"
                fill="none"
                style={{ borderRadius: 10 }}
              >
                <circle cx="12" cy="12" r="12" fill="#dff9ff" />
                <circle cx="12" cy="12" r="7" fill="#0b1636" />
              </svg>
              <div>
                <BotName>AI Assistant</BotName>
                <div style={{ fontSize: 12, color: "#9aa0a6" }}>
                  Sourav's helper
                </div>
              </div>
            </ChatHeader>

            <ChatBody>
              How can I help you? Or assist you — what question do you want to
              ask, From Sourav?
              <div style={{ marginTop: 8, fontSize: 13, color: "#bfbfbf" }}>
                You can just type below and mail it.
              </div>
            </ChatBody>

            <InputRow>
              <TextInput
                placeholder="Type your question..."
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
              />
              <MailBtn onClick={handleMail}>Mail it</MailBtn>
            </InputRow>
          </ChatPanel>
        )}
      </AnimatePresence>

      {/* Canvas */}
      <div
        style={{
          width: 220,
          height: 220,
          borderRadius: 18,
          overflow: "hidden",
          boxShadow: "0 10px 30px rgba(2,6,20,0.6)",
        }}
      >
        <Canvas camera={{ position: [0, 0, 3.2], fov: 50 }}>
          <ambientLight intensity={0.45} />
          <pointLight position={[3, 4, 3]} intensity={1.1} color={"#00f7f0"} />
          <pointLight
            position={[-3, -3, -2]}
            intensity={0.8}
            color={"#8b49f0"}
          />
          <directionalLight
            position={[0, 5, 2]}
            intensity={0.6}
            color={"#ffffff"}
          />
          <Html position={[0, -0.9, 0]} center>
            <div
              onClick={handleAssistantClick}
              role="button"
              aria-label="Open AI Assistant"
              style={{
                width: 220,
                height: 220,
                cursor: "pointer",
                display: "block",
                background: "transparent",
              }}
            />
          </Html>

          <FloatingBot
            clicked={open}
            setClicked={setOpen}
            handGesture={handGesture}
          />

          <OrbitControls
            enableZoom={false}
            enablePan={false}
            autoRotate={false}
          />
        </Canvas>
      </div>
    </AssistantContainer>
  );
}
