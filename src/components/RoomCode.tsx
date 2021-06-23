import copyImg from "../assets/images/copy.svg";
import "../styles/room-code.scss";

type RoomCodeProps = {
  code: string;
};

export const RoomCode = (props: RoomCodeProps) => {
  function copyRoomCodeToClipBoard() {
    navigator.clipboard.writeText(props.code);
    alert("Código copiado");
  }
  return (
    <button className="room-code" onClick={copyRoomCodeToClipBoard}>
      <div>
        <img src={copyImg} alt="Copiar room code" />
      </div>
      <span>Sala #{props.code}</span>
    </button>
  );
};
