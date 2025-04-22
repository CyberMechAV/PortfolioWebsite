import React from 'react';
import { Page } from '../Book';
import PaperRocket from '../PaperRocket';

const RocketPage: React.FC = () => {
  return (
    <Page pageNumber={16}>
      <div className="p-4 h-full">
        <PaperRocket />
      </div>
    </Page>
  );
};

export default RocketPage;