import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Users, UserCheck, Heart, TrendingUp, Calendar, Clock, AlertTriangle } from 'lucide-react';
import { getAnalytics } from '../utils/adminApi';
import { api } from '../utils/api';
import LoadingSpinner from '../components/LoadingSpinner';

const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: var(--spacing-6);
`;

const Header = styled.div`
  margin-bottom: var(--spacing-6);
  
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
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--spacing-4);
  margin-bottom: var(--spacing-6);
`;

const StatCard = styled.div`
  background: var(--white);
  border-radius: var(--radius-xl);
  padding: var(--spacing-5);
  box-shadow: var(--shadow-md);
  display: flex;
  align-items: center;
  gap: var(--spacing-4);
  transition: transform 0.2s;
  cursor: ${props => props.clickable ? 'pointer' : 'default'};
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-lg);
  }
`;

const IconWrapper = styled.div`
  width: 60px;
  height: 60px;
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.bg || 'var(--primary-light)'};
  color: ${props => props.color || 'var(--primary)'};
  flex-shrink: 0;
`;

const StatContent = styled.div`
  flex: 1;
  
  .label {
    font-size: var(--font-size-sm);
    color: var(--gray-600);
    margin-bottom: var(--spacing-1);
  }
  
  .value {
    font-size: var(--font-size-2xl);
    font-weight: 700;
    color: var(--gray-900);
  }
`;

const ChartsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: var(--spacing-6);
  margin-bottom: var(--spacing-6);
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ChartCard = styled.div`
  background: var(--white);
  border-radius: var(--radius-xl);
  padding: var(--spacing-6);
  box-shadow: var(--shadow-md);
  
  h2 {
    font-size: var(--font-size-xl);
    font-weight: 600;
    color: var(--gray-900);
    margin-bottom: var(--spacing-4);
  }
`;

const BarChart = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-3);
`;

const BarItem = styled.div`
  .bar-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: var(--spacing-2);
    font-size: var(--font-size-sm);
    
    .label {
      color: var(--gray-700);
      font-weight: 500;
    }
    
    .value {
      color: var(--gray-900);
      font-weight: 600;
    }
  }
  
  .bar-track {
    height: 12px;
    background: var(--gray-200);
    border-radius: var(--radius-full);
    overflow: hidden;
  }
  
  .bar-fill {
    height: 100%;
    background: ${props => props.color || 'var(--primary)'};
    border-radius: var(--radius-full);
    transition: width 0.6s ease;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
`;

const ErrorMessage = styled.div`
  background: #fee;
  border: 1px solid #fcc;
  border-radius: var(--radius-lg);
  padding: var(--spacing-4);
  color: #c33;
  text-align: center;
`;

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState(null);
  const [appointmentStats, setAppointmentStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [analyticsResponse, appointmentsResponse] = await Promise.all([
        getAnalytics(),
        api.admin.appointments.getAll()
      ]);

      if (analyticsResponse.success) {
        setAnalytics(analyticsResponse.analytics);
      }

      // Calculate appointment stats
      // Backend returns { success, appointments, pagination }
      const appointments = appointmentsResponse.data?.appointments || [];
      const upcoming = appointments.filter(a => a.status === 'upcoming').length;
      const completed = appointments.filter(a => a.status === 'completed').length;
      const today = appointments.filter(a =>
        new Date(a.date).toDateString() === new Date().toDateString()
      ).length;

      setAppointmentStats({ total: appointments.length, upcoming, completed, today });
    } catch (err) {
      setError(err.message || 'Failed to load data');
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

  if (error) {
    return (
      <Container>
        <ErrorMessage>{error}</ErrorMessage>
      </Container>
    );
  }

  if (!analytics || !appointmentStats) return null;

  const { totalUsers, genderDistribution, pregnancyStats, userActivity, emergencyStats } = analytics;

  return (
    <Container>
      <Header>
        <h1>Dashboard Overview</h1>
        <p>Monitor user statistics and pregnancy progress</p>
      </Header>

      <StatsGrid>
        <StatCard clickable onClick={() => navigate('/admin/users')}>
          <IconWrapper bg="#e0f2fe" color="#0284c7">
            <Users size={28} />
          </IconWrapper>
          <StatContent>
            <div className="label">Total Users</div>
            <div className="value">{totalUsers}</div>
          </StatContent>
        </StatCard>

        <StatCard clickable onClick={() => navigate('/admin/pregnancy')}>
          <IconWrapper bg="#fce7f3" color="#db2777">
            <Heart size={28} />
          </IconWrapper>
          <StatContent>
            <div className="label">Pregnant Users</div>
            <div className="value">{pregnancyStats.total}</div>
          </StatContent>
        </StatCard>

        <StatCard clickable onClick={() => navigate('/admin/users')}>
          <IconWrapper bg="#dcfce7" color="#16a34a">
            <UserCheck size={28} />
          </IconWrapper>
          <StatContent>
            <div className="label">Active Users (7 days)</div>
            <div className="value">{userActivity.activeUsers}</div>
          </StatContent>
        </StatCard>

        <StatCard clickable onClick={() => navigate('/admin/users')}>
          <IconWrapper bg="#fef3c7" color="#d97706">
            <TrendingUp size={28} />
          </IconWrapper>
          <StatContent>
            <div className="label">New Users (30 days)</div>
            <div className="value">{userActivity.newUsers}</div>
          </StatContent>
        </StatCard>

        <StatCard clickable onClick={() => navigate('/admin/appointments')}>
          <IconWrapper bg="#dbeafe" color="#3b82f6">
            <Calendar size={28} />
          </IconWrapper>
          <StatContent>
            <div className="label">Total Appointments</div>
            <div className="value">{appointmentStats.total}</div>
          </StatContent>
        </StatCard>

        <StatCard clickable onClick={() => navigate('/admin/appointments')}>
          <IconWrapper bg="#dcfce7" color="#16a34a">
            <Clock size={28} />
          </IconWrapper>
          <StatContent>
            <div className="label">Upcoming Appointments</div>
            <div className="value">{appointmentStats.upcoming}</div>
          </StatContent>
        </StatCard>

        <StatCard clickable onClick={() => navigate('/admin/emergencies')}>
          <IconWrapper bg="#fee2e2" color="#dc2626">
            <AlertTriangle size={28} />
          </IconWrapper>
          <StatContent>
            <div className="label">Total Emergencies</div>
            <div className="value">{emergencyStats?.total || 0}</div>
          </StatContent>
        </StatCard>

        <StatCard clickable onClick={() => navigate('/admin/emergencies')}>
          <IconWrapper bg="#fef3c7" color="#d97706">
            <Clock size={28} />
          </IconWrapper>
          <StatContent>
            <div className="label">Pending Emergencies</div>
            <div className="value">{emergencyStats?.pending || 0}</div>
          </StatContent>
        </StatCard>

        <StatCard clickable onClick={() => navigate('/admin/appointments')}>
          <IconWrapper bg="#e0f2fe" color="#0284c7">
            <Calendar size={28} />
          </IconWrapper>
          <StatContent>
            <div className="label">Today's Appointments</div>
            <div className="value">{appointmentStats.today}</div>
          </StatContent>
        </StatCard>
      </StatsGrid>

      <ChartsGrid>
        <ChartCard>
          <h2>Gender Distribution</h2>
          <BarChart>
            <BarItem color="#3b82f6">
              <div className="bar-header">
                <span className="label">Male</span>
                <span className="value">{genderDistribution.male}</span>
              </div>
              <div className="bar-track">
                <div 
                  className="bar-fill" 
                  style={{ width: `${(genderDistribution.male / totalUsers) * 100}%` }}
                />
              </div>
            </BarItem>

            <BarItem color="#ec4899">
              <div className="bar-header">
                <span className="label">Female</span>
                <span className="value">{genderDistribution.female}</span>
              </div>
              <div className="bar-track">
                <div 
                  className="bar-fill" 
                  style={{ width: `${(genderDistribution.female / totalUsers) * 100}%` }}
                />
              </div>
            </BarItem>

            <BarItem color="#8b5cf6">
              <div className="bar-header">
                <span className="label">Other</span>
                <span className="value">{genderDistribution.other}</span>
              </div>
              <div className="bar-track">
                <div 
                  className="bar-fill" 
                  style={{ width: `${(genderDistribution.other / totalUsers) * 100}%` }}
                />
              </div>
            </BarItem>
          </BarChart>
        </ChartCard>

        <ChartCard>
          <h2>Pregnancy by Trimester</h2>
          <BarChart>
            <BarItem color="#10b981">
              <div className="bar-header">
                <span className="label">First Trimester (1-13 weeks)</span>
                <span className="value">{pregnancyStats.firstTrimester}</span>
              </div>
              <div className="bar-track">
                <div 
                  className="bar-fill" 
                  style={{ width: `${(pregnancyStats.firstTrimester / pregnancyStats.total) * 100}%` }}
                />
              </div>
            </BarItem>

            <BarItem color="#f59e0b">
              <div className="bar-header">
                <span className="label">Second Trimester (14-27 weeks)</span>
                <span className="value">{pregnancyStats.secondTrimester}</span>
              </div>
              <div className="bar-track">
                <div 
                  className="bar-fill" 
                  style={{ width: `${(pregnancyStats.secondTrimester / pregnancyStats.total) * 100}%` }}
                />
              </div>
            </BarItem>

            <BarItem color="#ef4444">
              <div className="bar-header">
                <span className="label">Third Trimester (28+ weeks)</span>
                <span className="value">{pregnancyStats.thirdTrimester}</span>
              </div>
              <div className="bar-track">
                <div 
                  className="bar-fill" 
                  style={{ width: `${(pregnancyStats.thirdTrimester / pregnancyStats.total) * 100}%` }}
                />
              </div>
            </BarItem>
          </BarChart>
        </ChartCard>
      </ChartsGrid>
    </Container>
  );
};

export default AdminDashboard;
