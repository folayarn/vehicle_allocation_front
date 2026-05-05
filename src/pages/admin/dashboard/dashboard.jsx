import React, { useState } from 'react';
import useCardData from '../../../data/card-data';
import StatisticsCard, { StatisticsDetailModal } from '../../../components/CardComponent';
import { Typography } from '@material-tailwind/react';

const AdminDashboard = () => {
  const [selectedCard, setSelectedCard] = useState(null);
  const { statisticsCardsData, loading, error } = useCardData();

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-gray-200 h-48 rounded-lg"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center p-6">
        Error loading dashboard data: {error}
      </div>
    );
  }

  return (
    <div className="p-6">
      <Typography variant="h3" className="mb-6 font-bold">
        Dashboard Overview
      </Typography>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statisticsCardsData.map((card, index) => (
          <StatisticsCard 
            key={card.id || index} 
            data={card}
            onViewDetails={() => setSelectedCard(card)}
          />
        ))}
      </div>

      {/* Detail Modal */}
      <StatisticsDetailModal
        isOpen={!!selectedCard}
        onClose={() => setSelectedCard(null)}
        data={selectedCard}
      />
    </div>
  );
};

export default AdminDashboard;