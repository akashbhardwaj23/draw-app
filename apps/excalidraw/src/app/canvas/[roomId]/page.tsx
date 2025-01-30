import CanvasClient from "@/components/CanvasClient";


export default async function Canvas({ params } : {
    params : { roomId : string}
}){
    const roomId = (await params).roomId;
    console.log(roomId);
    
    return <CanvasClient roomId={roomId} />
}