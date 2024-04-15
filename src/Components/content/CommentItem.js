import avatar from "../../img/user.png";
import React from "react";

import { formatDate } from '../../utils/helpers';
import serverUrl from '../../utils/config';
export default function CommentItem({ comment }) {
    return (
            <li key={comment.id} className={'item'}>
                <div className="header__item">
                    <img src={avatar} alt="Аватар"/>
                    <p><strong>{comment && comment.user && comment.user[0] ? comment.user[0].username : 'Превью'}</strong></p>
                    <p>{formatDate(comment.created_at)}</p>
                </div>
                <div dangerouslySetInnerHTML={{ __html: comment.text }}></div>
                {comment.files && comment.files.length > 0 && (
                    <ul>
                        {comment.files.map((file, index) => (
                            <div key={index}>
                                {file.path.endsWith('.txt') ? (
                                    <a href={`${serverUrl}storage/files/${encodeURIComponent(file.path)}`}>{file.path}</a>
                                ) : (<>
                                        <a href={`${serverUrl}storage/files/${file.path}`} data-lightbox="roadtrip">
                                            <img className={'item__img'} src={`${serverUrl}storage/files/${file.path}`} alt={file.path} />
                                        </a>
                                    </>
                                )}
                            </div>
                        ))}
                    </ul>
                )}
                <hr/>
                <a href={`/create/${comment.id}`}>Reply</a>
                {comment.children && comment.children.length > 0 && (
                    <ul>
                        {comment.children.map(child => (
                            <CommentItem key={child.id} comment={child} />
                        ))}
                    </ul>
                )}
            </li>
    );
}
