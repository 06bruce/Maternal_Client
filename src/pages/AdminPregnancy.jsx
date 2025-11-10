import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Heart, Calendar, AlertCircle, Search } from 'lucide-react';
import { getPregnantUsers } from '../utils/adminApi';
import LoadingSpinner from '../components/LoadingSpinner';

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
  
  .header-left {
    h1 {
      font-size: var(--font-size-3xl);
      font-weight: 700;
      color: var(--gray-900);
      margin-bottom: var(--spacing-2);
    }
    
    p {
      color: var(--gray-600);
      font-size: var(--font-size-lg);
    }
  }
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

const StatsBar = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--spacing-4);
  margin-bottom: var(--spacing-6);
`;

const StatCard = styled.div`
  background: var(--white);
  border-radius: var(--radius-lg);
  padding: var(--spacing-4);
  box-shadow: var(--shadow-sm);
  
  .label {
    font-size: var(--font-size-sm);
    color: var(--gray-600);
    margin-bottom: var(--spacing-2);
  }
  
  .value {
    font-size: var(--font-size-2xl);
    font-weight: 700;
    color: var(--gray-900);
  }
`;

const UsersGrid = styled.div`
  display: grid;
  gap: var(--spacing-4);
`;

const UserCard = styled.div`
  background: var(--white);
  border-radius: var(--radius-xl);
  padding: var(--spacing-5);
  box-shadow: var(--shadow-md);
  display: grid;
  grid-template-columns: 1fr auto;
  gap: var(--spacing-4);
  align-items: start;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const UserInfo = styled.div`
  .name {
    font-size: var(--font-size-xl);
    font-weight: 600;
    color: var(--gray-900);
    margin-bottom: var(--spacing-2);
  }
  
  .details {
    display: flex;
    flex-wrap: wrap;
    gap: var(--spacing-4);
    margin-bottom: var(--spacing-3);
    
    .detail-item {
      display: flex;
      align-items: center;
      gap: var(--spacing-2);
      font-size: var(--font-size-sm);
      color: var(--gray-600);
      
      svg {
        color: var(--gray-400);
      }
    }
  }
`;

const ProgressSection = styled.div`
  margin-top: var(--spacing-3);
  
  .progress-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: var(--spacing-2);
    
    .week {
      font-size: var(--font-size-sm);
      font-weight: 600;
      color: var(--gray-700);
    }
    
    .percentage {
      font-size: var(--font-size-sm);
      color: var(--gray-600);
    }
  }
  
  .progress-bar {
    height: 8px;
    background: var(--gray-200);
    border-radius: var(--radius-full);
    overflow: hidden;
    
    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #ec4899, #db2777);
      border-radius: var(--radius-full);
      transition: width 0.6s ease;
    }
  }
`;

const TrimesterBadge = styled.div`
  padding: var(--spacing-2) var(--spacing-3);
  border-radius: var(--radius-full);
  font-size: var(--font-size-sm);
  font-weight: 600;
  text-align: center;
  background: ${props => {
    if (props.trimester === 'First') return '#dcfce7';
    if (props.trimester === 'Second') return '#fef3c7';
    return '#fee2e2';
  }};
  color: ${props => {
    if (props.trimester === 'First') return '#16a34a';
    if (props.trimester === 'Second') return '#d97706';
    return '#dc2626';
  }};
`;

const DueDateInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: var(--spacing-2);
  
  .due-date {
    font-size: var(--font-size-sm);
    color: var(--gray-600);
  }
  
  .days-left {
    font-size: var(--font-size-lg);
    font-weight: 600;
    color: ${props => {
      if (props.days < 30) return '#dc2626';
      if (props.days < 60) return '#d97706';
      return '#16a34a';
    }};
  }
`;

const AlertBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-2);
  padding: var(--spacing-2) var(--spacing-3);
  background: #fee;
  border: 1px solid #fcc;
  border-radius: var(--radius-lg);
  color: #c33;
  font-size: var(--font-size-sm);
  margin-top: var(--spacing-2);
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
  background: var(--white);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-md);
  
  svg {
    color: var(--gray-300);
    margin-bottom: var(--spacing-4);
  }
  
  h3 {
    font-size: var(--font-size-xl);
    color: var(--gray-700);
    margin-bottom: var(--spacing-2);
  }
  
  p {
    color: var(--gray-500);
  }
`;

const AdminPregnancy = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPregnantUsers();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(users);
    }
  }, [searchTerm, users]);

  const fetchPregnantUsers = async () => {
    try {
      setLoading(true);
      const data = await getPregnantUsers();
      if (data.success) {
        setUsers(data.users);
        setFilteredUsers(data.users);
      }
    } catch (err) {
      console.error('Failed to load pregnant users:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <LoadingContainer>
        <LoadingSpinner />
      </LoadingContainer>
    );
  }

  const firstTrimester = filteredUsers.filter(u => u.trimester === 'First').length;
  const secondTrimester = filteredUsers.filter(u => u.trimester === 'Second').length;
  const thirdTrimester = filteredUsers.filter(u => u.trimester === 'Third').length;
  const dueSoon = filteredUsers.filter(u => u.daysUntilDue && u.daysUntilDue <= 30).length;

  return (
    <Container>
      <Header>
        <div className="header-left">
          <h1>Pregnancy Monitoring</h1>
          <p>Track and monitor pregnancy progress for all users</p>
        </div>
        <SearchBox>
          <Search size={18} />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </SearchBox>
      </Header>

      <StatsBar>
        <StatCard>
          <div className="label">Total Pregnant Users</div>
          <div className="value">{filteredUsers.length}</div>
        </StatCard>
        <StatCard>
          <div className="label">First Trimester</div>
          <div className="value">{firstTrimester}</div>
        </StatCard>
        <StatCard>
          <div className="label">Second Trimester</div>
          <div className="value">{secondTrimester}</div>
        </StatCard>
        <StatCard>
          <div className="label">Third Trimester</div>
          <div className="value">{thirdTrimester}</div>
        </StatCard>
        <StatCard>
          <div className="label">Due Within 30 Days</div>
          <div className="value">{dueSoon}</div>
        </StatCard>
      </StatsBar>

      {filteredUsers.length === 0 ? (
        <EmptyState>
          <Heart size={64} />
          <h3>No Pregnant Users {searchTerm && 'Found'}</h3>
          <p>{searchTerm ? 'Try adjusting your search criteria.' : 'There are currently no users marked as pregnant in the system.'}</p>
        </EmptyState>
      ) : (
        <UsersGrid>
          {filteredUsers.map((user) => {
            const progressPercentage = ((user.currentWeek || 0) / 40) * 100;
            
            return (
              <UserCard key={user._id}>
                <UserInfo>
                  <div className="name">{user.name}</div>
                  
                  <div className="details">
                    <div className="detail-item">
                      <Calendar size={16} />
                      <span>{user.email}</span>
                    </div>
                    {user.age && (
                      <div className="detail-item">
                        <span>{user.age} years old</span>
                      </div>
                    )}
                    {user.phone && (
                      <div className="detail-item">
                        <span>{user.phone}</span>
                      </div>
                    )}
                  </div>

                  <ProgressSection>
                    <div className="progress-header">
                      <span className="week">Week {user.currentWeek || 0} of 40</span>
                      <span className="percentage">{progressPercentage.toFixed(0)}%</span>
                    </div>
                    <div className="progress-bar">
                      <div 
                        className="progress-fill" 
                        style={{ width: `${progressPercentage}%` }}
                      />
                    </div>
                  </ProgressSection>

                  {user.daysUntilDue && user.daysUntilDue <= 30 && (
                    <AlertBadge>
                      <AlertCircle size={16} />
                      <span>Due date approaching soon!</span>
                    </AlertBadge>
                  )}
                </UserInfo>

                <DueDateInfo days={user.daysUntilDue}>
                  <TrimesterBadge trimester={user.trimester}>
                    {user.trimester} Trimester
                  </TrimesterBadge>
                  
                  {user.dueDate && (
                    <>
                      <div className="due-date">
                        Due: {new Date(user.dueDate).toLocaleDateString()}
                      </div>
                      {user.daysUntilDue !== undefined && (
                        <div className="days-left">
                          {user.daysUntilDue > 0 
                            ? `${user.daysUntilDue} days left`
                            : user.daysUntilDue === 0
                            ? 'Due today!'
                            : `${Math.abs(user.daysUntilDue)} days overdue`
                          }
                        </div>
                      )}
                    </>
                  )}
                </DueDateInfo>
              </UserCard>
            );
          })}
        </UsersGrid>
      )}
    </Container>
  );
};

export default AdminPregnancy;
