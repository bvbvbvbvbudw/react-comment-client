import React, { useEffect, useState } from 'react';
import CommentForm from "./CommentForm";
import CommentList from "./CommentList";
import serverUrl from '../../utils/config'
export default function Form({ parentId, updateComments, currentPage }) {

    const [comments, setComments] = useState([]);

    useEffect(() => {
        if(parentId){
            fetch(`${serverUrl}api/comments?id=${parentId}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Ошибка при запросе');
                    }
                    return response.json();
                })
                .then(data => {
                    setComments(prevComments => [...prevComments, ...data.data]);
                })
                .catch(error => {
                    console.error('Ошибка:', error);
                });
        }
    }, [parentId]);


    return (
        <>
            <CommentForm setComments={setComments} parentId={parentId} updateComments={updateComments} currentPage={currentPage} />
            <CommentList parentId={parentId} comments={comments} />
        </>
    );
}
