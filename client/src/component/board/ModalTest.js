import React, { useState } from "react";
import Modal from "react-modal";

Modal.setAppElement("#root");

function ModalTest() {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button onClick={() => setOpen(true)}>모달 열기</button>
      <Modal isOpen={open} onRequestClose={() => setOpen(false)}>
        <h2>테스트 모달</h2>
        <button onClick={() => setOpen(false)}>닫기</button>
      </Modal>
    </div>
  );
}

export default ModalTest;
