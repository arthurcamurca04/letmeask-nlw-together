import { useEffect, useState } from "react";
import { database } from "../services/firebase";
import { useAuth } from "./useAuth";

type FirebaseQuestions = Record<
  string,
  {
    author: {
      name: string;
      avatar: string;
    };
    content: string;
    isAnswered: boolean;
    isHighlighted: boolean;
    likes: Record<string, {
      authorId: string
    }>
  }
>;

type QuestionType = {
    id: string;
    author: {
      name: string;
      avatar: string;
    };
    content: string;
    isAnswered: boolean;
    isHighlighted: boolean;
    likeCount: number;
    likeId: string | undefined;
  };
export const useRoom = (roomId: string) => {
  const {user} = useAuth();
    const [questions, setQuestions] = useState<QuestionType[]>([]);
    const [title, setTitle] = useState("");

    useEffect(() => {
        const roomRef = database.ref(`/rooms/${roomId}`);
        roomRef.on("value", (room) => {
          const databaseRoom = room.val();
          const firebaseQuestions: FirebaseQuestions = databaseRoom.questions ?? {};
          const parsedQuestions = Object.entries(firebaseQuestions).map(
            ([key, val]) => {
              return {
                id: key,
                content: val.content,
                author: val.author,
                isHighlighted: val.isHighlighted,
                isAnswered: val.isAnswered,
                likeCount: Object.values(val.likes ?? {}).length,
                likeId: Object.entries(val.likes ?? {}).find(([key, like]) => like.authorId === user?.id)?.[0],
              };
            }
          );
          setTitle(databaseRoom.title);
          setQuestions(parsedQuestions);
        });

        return () => {
          roomRef.off("value")
        }
      }, [roomId, user?.id]);

      return {title, questions}
}