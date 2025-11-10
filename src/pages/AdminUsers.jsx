import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Search, Edit2, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { getUsers, deleteUser } from '../utils/adminApi';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: var(--spacing-6);
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-6);
  flex-wrap: wrap;
  gap: var(--spacing-4);
  
  h1 {
    font-size: var(--font-size-3xl);
    font-weight: 700;
    color: var(--gray-900);
  }
`;

const Controls = styled.div`
  display: flex;
  gap: var(--spacing-3);
  flex-wrap: wrap;
`;

const SearchBox = styled.div`
  position: relative;
  
  svg {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: var(--gray-400);
  }
  
  input {
    padding: var(--spacing-2) var(--spacing-3) var(--spacing-2) 40px;
    border: 2px solid var(--gray-200);
    border-radius: var(--radius-lg);
    font-size: var(--font-size-sm);
    min-width: 250px;
    
    &:focus {
      outline: none;
      border-color: var(--primary);
    }
  }
`;

const FilterSelect = styled.select`
  padding: var(--spacing-2) var(--spacing-3);
  border: 2px solid var(--gray-200);
  border-radius: var(--radius-lg);
  font-size: var(--font-size-sm);
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: var(--primary);
  }
`;

const TableCard = styled.div`
  background: var(--white);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-md);
  overflow: hidden;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  
  thead {
    background: var(--gray-50);
    
    th {
      padding: var(--spacing-4);
      text-align: left;
      font-size: var(--font-size-sm);
      font-weight: 600;
      color: var(--gray-700);
      border-bottom: 2px solid var(--gray-200);
    }
  }
  
  tbody {
    tr {
      border-bottom: 1px solid var(--gray-100);
      transition: background 0.2s;
      
      &:hover {
        background: var(--gray-50);
      }
      
      td {
        padding: var(--spacing-4);
        font-size: var(--font-size-sm);
        color: var(--gray-700);
      }
    }
  }
`;

const Badge = styled.span`
  display: inline-block;
  padding: 4px 12px;
  border-radius: var(--radius-full);
  font-size: var(--font-size-xs);
  font-weight: 600;
  background: ${props => {
    if (props.variant === 'pregnant') return '#dcfce7';
    if (props.variant === 'male') return '#dbeafe';
    if (props.variant === 'female') return '#fce7f3';
    return '#f3f4f6';
  }};
  color: ${props => {
    if (props.variant === 'pregnant') return '#16a34a';
    if (props.variant === 'male') return '#2563eb';
    if (props.variant === 'female') return '#db2777';
    return '#6b7280';
  }};
`;

const ActionButtons = styled.div`
  display: flex;
  gap: var(--spacing-2);
`;

const IconButton = styled.button`
  padding: var(--spacing-2);
  border: none;
  background: transparent;
  color: ${props => props.danger ? '#ef4444' : 'var(--primary)'};
  cursor: pointer;
  border-radius: var(--radius-md);
  transition: background 0.2s;
  
  &:hover {
    background: ${props => props.danger ? '#fee' : 'var(--primary-light)'};
  }
`;

const Pagination = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-4);
  border-top: 1px solid var(--gray-200);
  
  .info {
    font-size: var(--font-size-sm);
    color: var(--gray-600);
  }
  
  .buttons {
    display: flex;
    gap: var(--spacing-2);
  }
`;

const PageButton = styled.button`
  padding: var(--spacing-2) var(--spacing-3);
  border: 1px solid var(--gray-200);
  background: var(--white);
  color: var(--gray-700);
  border-radius: var(--radius-md);
  cursor: pointer;
  font-size: var(--font-size-sm);
  display: flex;
  align-items: center;
  gap: var(--spacing-1);
  
  &:hover:not(:disabled) {
    background: var(--gray-50);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: var(--spacing-8);
  color: var(--gray-500);
`;

const AdminUsers = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [genderFilter, setGenderFilter] = useState('');
  const [pregnantFilter, setPregnantFilter] = useState('');
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalUsers: 0
  });

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.currentPage,
        limit: 20
      };
      
      if (search) params.search = search;
      if (genderFilter) params.gender = genderFilter;
      if (pregnantFilter) params.isPregnant = pregnantFilter;

      const data = await getUsers(params);
      
      if (data.success) {
        setUsers(data.users);
        setPagination(data.pagination);
      }
    } catch (err) {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  }, [pagination.currentPage, genderFilter, pregnantFilter, search]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (search !== undefined) {
        fetchUsers();
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [search, fetchUsers]);

  const handleDelete = async (userId, userName) => {
    if (!window.confirm(`Are you sure you want to delete ${userName}?`)) {
      return;
    }

    try {
      const result = await deleteUser(userId);
      if (result.success) {
        toast.success('User deleted successfully');
        fetchUsers();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to delete user');
    }
  };

  const handleEdit = (userId) => {
    navigate(`/admin/users/${userId}/edit`);
  };

  if (loading && users.length === 0) {
    return (
      <LoadingContainer>
        <LoadingSpinner />
      </LoadingContainer>
    );
  }

  return (
    <Container>
      <Header>
        <h1>User Management</h1>
        <Controls>
          <SearchBox>
            <Search size={18} />
            <input
              type="text"
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </SearchBox>
          
          <FilterSelect
            value={genderFilter}
            onChange={(e) => setGenderFilter(e.target.value)}
          >
            <option value="">All Genders</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </FilterSelect>
          
          <FilterSelect
            value={pregnantFilter}
            onChange={(e) => setPregnantFilter(e.target.value)}
          >
            <option value="">All Users</option>
            <option value="true">Pregnant Only</option>
            <option value="false">Not Pregnant</option>
          </FilterSelect>
        </Controls>
      </Header>

      <TableCard>
        {users.length === 0 ? (
          <EmptyState>
            <p>No users found</p>
          </EmptyState>
        ) : (
          <>
            <Table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Gender</th>
                  <th>Age</th>
                  <th>Status</th>
                  <th>Week</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>
                      <Badge variant={user.gender}>
                        {user.gender}
                      </Badge>
                    </td>
                    <td>{user.age || '-'}</td>
                    <td>
                      {user.isPregnant && (
                        <Badge variant="pregnant">Pregnant</Badge>
                      )}
                    </td>
                    <td>{user.isPregnant ? `Week ${user.currentWeek || 0}` : '-'}</td>
                    <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td>
                      <ActionButtons>
                        <IconButton onClick={() => handleEdit(user._id)}>
                          <Edit2 size={16} />
                        </IconButton>
                        <IconButton 
                          danger 
                          onClick={() => handleDelete(user._id, user.name)}
                        >
                          <Trash2 size={16} />
                        </IconButton>
                      </ActionButtons>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>

            <Pagination>
              <div className="info">
                Showing {((pagination.currentPage - 1) * 20) + 1} to{' '}
                {Math.min(pagination.currentPage * 20, pagination.totalUsers)} of{' '}
                {pagination.totalUsers} users
              </div>
              <div className="buttons">
                <PageButton
                  onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage - 1 }))}
                  disabled={pagination.currentPage === 1}
                >
                  <ChevronLeft size={16} />
                  Previous
                </PageButton>
                <PageButton
                  onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage + 1 }))}
                  disabled={pagination.currentPage === pagination.totalPages}
                >
                  Next
                  <ChevronRight size={16} />
                </PageButton>
              </div>
            </Pagination>
          </>
        )}
      </TableCard>
    </Container>
  );
};

export default AdminUsers;
