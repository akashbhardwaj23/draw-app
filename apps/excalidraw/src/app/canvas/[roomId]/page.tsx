import RoomCanvasClient from "@/components/RoomCanvasClient";


export default async function Canvas({ params } : {
    params : { roomId : string}
}){
    const roomId = (await params).roomId;
    console.log(roomId);

    return <RoomCanvasClient roomId={roomId} />
}