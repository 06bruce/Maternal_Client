import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { MapPin, Phone, Clock, Star, Loader, Navigation } from 'lucide-react';
import { api } from '../utils/api';
import SectorSelectionModal from '../components/SectorSelectionModal';
import toast from 'react-hot-toast';

const Container = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: var(--spacing-4);
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: var(--spacing-8);
  
  h1 {
    font-size: var(--font-size-3xl);
    font-weight: 700;
    color: var(--gray-900);
    margin-bottom: var(--spacing-4);
  }
  
  p {
    font-size: var(--font-size-lg);
    color: var(--gray-600);
  }
`;

const LocationBanner = styled.div`
  background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
  color: var(--white);
  padding: var(--spacing-4);
  border-radius: var(--radius-xl);
  margin-bottom: var(--spacing-6);
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: var(--shadow-lg);
  
  .location-info {
    display: flex;
    align-items: center;
    gap: var(--spacing-3);
    
    svg {
      width: 24px;
      height: 24px;
    }
    
    div {
      h3 {
        font-size: var(--font-size-lg);
        font-weight: 600;
        margin-bottom: var(--spacing-1);
      }
      
      p {
        font-size: var(--font-size-sm);
        opacity: 0.9;
      }
    }
  }
  
  button {
    background: var(--white);
    color: var(--primary);
    border: none;
    padding: var(--spacing-2) var(--spacing-4);
    border-radius: var(--radius-lg);
    font-weight: 600;
    cursor: pointer;
    transition: all var(--transition-normal);
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-md);
    }
  }
`;

const CentersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: var(--spacing-6);
`;

const CenterCard = styled.div`
  background: var(--white);
  border-radius: var(--radius-xl);
  padding: var(--spacing-6);
  box-shadow: var(--shadow-md);
  
  h3 {
    font-size: var(--font-size-xl);
    font-weight: 600;
    color: var(--gray-900);
    margin-bottom: var(--spacing-3);
  }
  
  .info-item {
    display: flex;
    align-items: center;
    gap: var(--spacing-2);
    margin-bottom: var(--spacing-2);
    color: var(--gray-600);
    
    svg {
      color: var(--primary);
      width: 16px;
      height: 16px;
    }
  }
  
  .rating {
    display: flex;
    align-items: center;
    gap: var(--spacing-1);
    margin-top: var(--spacing-3);
    
    .stars {
      display: flex;
      gap: 2px;
    }
  }
`;

const HealthCenters = () => {
  const [centers, setCenters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showSectorModal, setShowSectorModal] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [userCoordinates, setUserCoordinates] = useState(null);
  const [locating, setLocating] = useState(false);

  const fetchHealthCentersBySector = async (district, sector) => {
    try {
      setLoading(true);
      setError(null);
      
      // Call API with sector parameter
      const response = await api.health.getCentersBySector(district, sector);
      const hospitals = response.data.hospitals || [];
      setCenters(hospitals);
      
      if (hospitals.length === 0) {
        toast.error('No hospitals found in this sector.');
      }
    } catch (err) {
      console.error('Failed to fetch health centers:', err);
      setError('Failed to load health centers. Please try again later.');
      toast.error('Failed to load hospitals');
      setCenters([]);
    } finally {
      setLoading(false);
    }
  };

  const getUserLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser');
      return;
    }

    setLocating(true);
    toast.loading('Getting your location...');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserCoordinates({ latitude, longitude });
        setLocating(false);
        toast.dismiss();
        toast.success('Location detected!');
        fetchNearbyHospitals(latitude, longitude);
      },
      (error) => {
        setLocating(false);
        toast.dismiss();
        console.error('Geolocation error:', error);
        
        switch(error.code) {
          case error.PERMISSION_DENIED:
            toast.error('Location permission denied. Please enable location access.');
            break;
          case error.POSITION_UNAVAILABLE:
            toast.error('Location information unavailable.');
            break;
          case error.TIMEOUT:
            toast.error('Location request timed out.');
            break;
          default:
            toast.error('Failed to get location.');
        }
        // Show sector modal as fallback
        setShowSectorModal(true);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  const fetchNearbyHospitals = async (latitude, longitude) => {
    try {
      setLoading(true);
      setError(null);
      
      // Call API with coordinates
      const response = await api.health.getCenters();
      const allHospitals = response.data.hospitals || [];
      
      // Calculate distance and sort by proximity
      const hospitalsWithDistance = allHospitals.map(hospital => {
        const distance = calculateDistance(
          latitude,
          longitude,
          hospital.latitude || 0,
          hospital.longitude || 0
        );
        return { ...hospital, distance: distance.toFixed(1) };
      });

      // Sort by distance and take closest ones
      const sortedHospitals = hospitalsWithDistance
        .filter(h => h.distance < 50) // Only show hospitals within 50km
        .sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));

      setCenters(sortedHospitals);
      
      if (sortedHospitals.length === 0) {
        toast.error('No hospitals found nearby. Try selecting your sector manually.');
        setShowSectorModal(true);
      } else {
        toast.success(`Found ${sortedHospitals.length} nearby hospitals`);
      }
    } catch (err) {
      console.error('Failed to fetch nearby hospitals:', err);
      setError('Failed to load nearby hospitals.');
      toast.error('Failed to load nearby hospitals');
      setCenters([]);
      setShowSectorModal(true);
    } finally {
      setLoading(false);
    }
  };

  // Haversine formula to calculate distance between two coordinates
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const toRadians = (degrees) => {
    return degrees * (Math.PI / 180);
  };

  const handleSelectSector = (location) => {
    setSelectedLocation(location);
    setShowSectorModal(false);
    fetchHealthCentersBySector(location.district, location.sector);
    
    // Save to localStorage for future visits
    localStorage.setItem('userSector', JSON.stringify(location));
  };

  useEffect(() => {
    // Check if user has previously selected a sector
    const savedSector = localStorage.getItem('userSector');
    if (savedSector) {
      const location = JSON.parse(savedSector);
      setSelectedLocation(location);
      setShowSectorModal(false);
      fetchHealthCentersBySector(location.district, location.sector);
    } else {
      // Try auto-locate on first visit
      setShowSectorModal(false);
      getUserLocation();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star 
          key={i} 
          size={16} 
          fill={i <= rating ? "gold" : "none"}
          color={i <= rating ? "gold" : "#ccc"}
        />
      );
    }
    return stars;
  };

  if (loading) {
    return (
      <Container>
        <Header>
          <h1>Health Centers</h1>
          <p>Loading health centers...</p>
        </Header>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <Loader size={48} className="animate-spin" />
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Header>
          <h1>Health Centers</h1>
          <p style={{ color: 'red' }}>{error}</p>
        </Header>
      </Container>
    );
  }

  return (
    <Container>
      <SectorSelectionModal
        isOpen={showSectorModal}
        onClose={() => setShowSectorModal(false)}
        onSelectSector={handleSelectSector}
      />

      <Header>
        <h1>Health Centers</h1>
        <p>Find nearby health centers and hospitals</p>
      </Header>

      {selectedLocation && (
        <LocationBanner>
          <div className="location-info">
            <Navigation />
            <div>
              <h3>{selectedLocation.sector} Sector</h3>
              <p>{selectedLocation.district} District</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button onClick={getUserLocation}>
              <MapPin size={16} style={{ marginRight: '0.5rem' }} />
              Auto-Locate
            </button>
            <button onClick={() => setShowSectorModal(true)}>
              Change Location
            </button>
          </div>
        </LocationBanner>
      )}

      {userCoordinates && !selectedLocation && (
        <LocationBanner>
          <div className="location-info">
            <MapPin />
            <div>
              <h3>Your Location</h3>
              <p>Showing nearby hospitals based on your current location</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button onClick={getUserLocation}>
              <Navigation size={16} style={{ marginRight: '0.5rem' }} />
              Refresh
            </button>
            <button onClick={() => setShowSectorModal(true)}>
              Select Manually
            </button>
          </div>
        </LocationBanner>
      )}

      {!selectedLocation && !userCoordinates && !loading && (
        <LocationBanner>
          <div className="location-info">
            <MapPin />
            <div>
              <h3>Find Nearby Hospitals</h3>
              <p>Use your location or select your sector</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button onClick={getUserLocation} disabled={locating}>
              <Navigation size={16} style={{ marginRight: '0.5rem' }} />
              {locating ? 'Locating...' : 'Auto-Locate'}
            </button>
            <button onClick={() => setShowSectorModal(true)}>
              Select Sector
            </button>
          </div>
        </LocationBanner>
      )}

      {loading && (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <Loader size={48} className="animate-spin" style={{ margin: '0 auto' }} />
          <p style={{ marginTop: '1rem', color: 'var(--gray-600)' }}>
            Finding hospitals in your area...
          </p>
        </div>
      )}

      {!loading && centers.length > 0 && (
        <CentersGrid>
          {centers.map((center, index) => (
            <CenterCard key={index}>
              <h3>{center.name}</h3>
              <div className="info-item">
                <MapPin />
                <span>{center.location}</span>
              </div>
              {center.distance && (
                <div className="info-item">
                  <Navigation />
                  <span>{center.distance} km away</span>
                </div>
              )}
              <div className="info-item">
                <Phone />
                <span>{center.phone}</span>
              </div>
              <div className="info-item">
                <Clock />
                <span>{center.hours}</span>
              </div>
              <div className="rating">
                <span>Rating: </span>
                <div className="stars">
                  {renderStars(center.rating)}
                </div>
                <span>({center.rating})</span>
              </div>
            </CenterCard>
          ))}
        </CentersGrid>
      )}

      {!loading && centers.length === 0 && !showSectorModal && (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--gray-600)' }}>
          <p>No hospitals found in your selected area.</p>
          <button 
            onClick={() => setShowSectorModal(true)}
            style={{
              marginTop: '1rem',
              padding: '0.75rem 1.5rem',
              background: 'var(--primary)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            Select Different Location
          </button>
        </div>
      )}
    </Container>
  );
};

export default HealthCenters;