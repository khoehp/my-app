import React, { useEffect, useState } from 'react';
import { ApiService } from './index';

// Interface cho dữ liệu user
interface User {
  id: number;
  name: string;
  email: string;
}

const UserComponent: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Hàm để fetch users
    const fetchUsers = async () => {
      try {
        setLoading(true);
        // Sử dụng ApiService để gọi API
        const response = await ApiService.get<User[]>('/users');
        setUsers(response.data);
        setError(null);
      } catch (err) {
        setError('Có lỗi xảy ra khi lấy dữ liệu người dùng');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Hàm để tạo user mới
  const createUser = async (userData: Omit<User, 'id'>) => {
    try {
      const response = await ApiService.post<User>('/users', userData);
      setUsers([...users, response.data]);
      return response.data;
    } catch (err) {
      console.error('Lỗi khi tạo user:', err);
      throw err;
    }
  };

  // Hàm để cập nhật user
  const updateUser = async (id: number, userData: Partial<User>) => {
    try {
      const response = await ApiService.put<User>(`/users/${id}`, userData);
      setUsers(users.map(user => user.id === id ? response.data : user));
      return response.data;
    } catch (err) {
      console.error(`Lỗi khi cập nhật user ${id}:`, err);
      throw err;
    }
  };

  // Hàm để xóa user
  const deleteUser = async (id: number) => {
    try {
      await ApiService.delete<void>(`/users/${id}`);
      setUsers(users.filter(user => user.id !== id));
    } catch (err) {
      console.error(`Lỗi khi xóa user ${id}:`, err);
      throw err;
    }
  };

  if (loading) return <div>Đang tải...</div>;
  if (error) return <div>Lỗi: {error}</div>;

  return (
    <div>
      <h1>Danh sách người dùng</h1>
      <ul>
        {users.map(user => (
          <li key={user.id}>
            {user.name} ({user.email})
            <button onClick={() => updateUser(user.id, { name: `${user.name} (đã cập nhật)` })}>
              Cập nhật
            </button>
            <button onClick={() => deleteUser(user.id)}>Xóa</button>
          </li>
        ))}
      </ul>
      <button onClick={() => createUser({ name: 'Người dùng mới', email: 'new@example.com' })}>
        Thêm người dùng
      </button>
    </div>
  );
};

export default UserComponent;