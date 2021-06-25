import { useEffect, useState } from "react";
import { database } from "../services/firebase";

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
  };
export const useRoom = (roomId: string) => {
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
              };
            }
          );
          setTitle(databaseRoom.title);
          setQuestions(parsedQuestions);
        });
      }, [roomId]);

      return {title, questions}
}