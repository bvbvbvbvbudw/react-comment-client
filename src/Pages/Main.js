import React, { useEffect, useState } from 'react';

import Layout from "../Layout/Layout";
import Form from "../Components/content/Form";
import SortControl from "../Components/content/SortControl";
import CommentItem from "../Components/content/CommentItem";

import Pagination from "../Components/content/Pagination";
import Loading from "../Components/content/Loading";

import 'lightbox2/src/css/lightbox.css';
import 'lightbox2/src/js/lightbox';

import serverUrl from '../utils/config';
import Pusher from "pusher-js";

export default function Main() {
    const [comments, setComments] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [sortBy, setSortBy] = useState('created_at');
    const [sortOrder, setSortOrder] = useState('desc');

    const [isShow, setIsShow] = useState(false);

    useEffect(() => {
        const cachedComments = JSON.parse(localStorage.getItem('cachedComments'));
        if (cachedComments) {
            setComments(cachedComments);
        }

        updateComments(currentPage);
    }, [currentPage, sortBy, sortOrder]);

    const updateComments = (page) => {
        setIsShow(true);
        fetch(`${serverUrl}api/comments?page=${page}&sort_by=${sortBy}&sort_order=${sortOrder}`)
            .then(response => response.json())
            .then(data => {
                setIsShow(false);
                setComments(Array.isArray(data.data.data) ? data.data.data : []);
                setTotalPages(data.data.last_page);

                localStorage.setItem('cachedComments', data.data.data ? JSON.stringify(data.data.data) : [{}]);
            })
            .catch(error => {
                console.error(error);
            });
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleSortChange = (sortBy, sortOrder) => {
        setSortBy(sortBy);
        setSortOrder(sortOrder);
        updateComments(currentPage);
    };
    useEffect(() => {
        const pusher = new Pusher('f9ce5503531c7a98a702', {
            cluster: 'eu',
            encrypted: true,
        });

        const channel = pusher.subscribe('comment-channel');

        const findAndAddComment = (comments, commentToAdd) => {
            for (let comment of comments) {
                if (comment.id === commentToAdd.parent_id) {
                    comment.children = [...(comment.children || []), commentToAdd];
                    return true;
                }
                if (comment.children && findAndAddComment(comment.children, commentToAdd)) {
                    return true;
                }
            }
            return false;
        };

        const handleCommentUpdate = (data) => {
            setComments(prevComments => {
                if (prevComments.length >= 25) {
                    return prevComments;
                }
                if (prevComments.find(comment => comment.id === data.comment.id)) {
                    return prevComments;
                }
                if (data.comment.parent_id) {
                    const updatedComments = [...prevComments];
                    if (!findAndAddComment(updatedComments, data.comment)) {
                        updatedComments.push(data.comment);
                    }
                    return updatedComments;
                }
                return [data.comment, ...prevComments];
            });
            const updatedComments = JSON.stringify(comments);
            localStorage.setItem('cachedComments', updatedComments);
        };

        channel.bind('comment-updated', handleCommentUpdate);

        return () => {
            channel.unbind('comment-updated', handleCommentUpdate);
            pusher.unsubscribe('comment-channel');
        };
    }, []);

    useEffect(()=>{
        const updatedComments = JSON.stringify(comments);
        localStorage.setItem('cachedComments', updatedComments);
    },[comments])

    return (
        <Layout>
            <Form currentPage={currentPage} updateComments={() => updateComments(currentPage)} />
            <SortControl onSortChange={handleSortChange} />

            <Pagination currentPage={currentPage} totalPages={totalPages} handlePageChange={handlePageChange}/>
            <Loading isShow={isShow}/>
            <ul className="list-group container__comments">
                {comments ? comments.map(comment => (
                    <CommentItem key={comment.id} comment={comment} />
                )) : null}
            </ul>
            <Pagination currentPage={currentPage} totalPages={totalPages} handlePageChange={handlePageChange}/>
        </Layout>
    );
}
