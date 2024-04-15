import React, { useEffect, useState } from 'react';
import Pusher from 'pusher-js';
import CommentItem from './CommentItem';

export default function CommentList({comments}) {
    // const [comments, setComments] = useState([]);



    return (
        <ul className="list-group container__comments">
            {comments.map(comment => (
                <CommentItem key={comment.id} comment={comment} />
            ))}
        </ul>
    );
}
