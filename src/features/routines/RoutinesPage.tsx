import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useRoutines, useRoutineDispatch } from './RoutineContext';

export const RoutinesPage: React.FC = () => {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const routines = useRoutines();
  const dispatch = useRoutineDispatch();

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setError('Tên giáo án không được để trống');
      return;
    }
    const duplicate = routines.some(
      (r) => r.name.toLowerCase() === trimmed.toLowerCase()
    );
    if (duplicate) {
      setError('Tên giáo án đã tồn tại');
      return;
    }

    dispatch({ type: 'create', payload: { name: trimmed } });
    setName('');
    setError('');
  };

  const handleRemove = (id: string) => {
    dispatch({ type: 'remove', payload: { id } });
  };

  return (
    <div className="routines-page page-container">
      <header className="page-header">
        <h1>Danh sách giáo án</h1>
      </header>

      <form className="routine-form" onSubmit={handleCreate}>
        <div className="form-group inline-group">
          <label htmlFor="routine-name-input">Tên giáo án</label>
          <input
            id="routine-name-input"
            type="text"
            placeholder="Nhập tên giáo án..."
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (error) setError('');
            }}
          />
          <button type="submit" className="btn btn-primary">
            Tạo
          </button>
        </div>
        {error && <p className="error-message">{error}</p>}
      </form>

      <div className="routine-list">
        {routines.length === 0 ? (
          <p className="no-data-msg">Chưa có giáo án nào</p>
        ) : (
          <div className="routine-cards">
            {routines.map((routine) => (
              <div
                key={routine.id}
                className="routine-card"
                data-testid={`routine-card-${routine.id}`}
              >
                <div className="routine-info">
                  <h3 className="routine-title">{routine.name}</h3>
                  <span className="routine-count">
                    {routine.exerciseIds.length} bài
                  </span>
                </div>
                <div className="routine-actions">
                  <Link
                    to={`/routines/${routine.id}`}
                    className="btn btn-secondary link-btn"
                  >
                    Chi tiết
                  </Link>
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => handleRemove(routine.id)}
                  >
                    Xóa
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RoutinesPage;
