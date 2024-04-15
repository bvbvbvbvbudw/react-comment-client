import React, { useState } from 'react';

export default function SortControl({ onSortChange }) {
    const [sortBy, setSortBy] = useState('created_at');
    const [sortOrder, setSortOrder] = useState('desc');

    const handleSortChange = () => {
        onSortChange(sortBy, sortOrder);
    };

    return (
        <div className="sort-control">
            <select className="sort-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="" disabled>Выбрать</option>
                <option value="username">По имени</option>
                <option value="email">По Емейлу</option>
                <option value="created_at">По дате</option>
            </select>
            <select className="sort-select" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
                <option value="asc">По возрастанию</option>
                <option value="desc">По убыванию</option>
            </select>
            <button className="sort-button" onClick={handleSortChange}>Сортировать</button>
        </div>
    );
}
