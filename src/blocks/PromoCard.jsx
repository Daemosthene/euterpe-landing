import React from 'react';
import styled from 'styled-components';

const PromoCard = ({ title, children }) => {
  return (
    <StyledWrapper>
      <div className="card">
        <p className="card-title">{title}</p>
        <div className="small-desc">
          {children}
        </div>
        <div className="go-corner">
          <div className="go-arrow">→</div>
        </div>
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .card-title {
    color: #f2f2f2;
    font-size: 1.5em;
    line-height: normal;
    font-weight: 700;
    margin-bottom: 0.5em;
    position: relative;
    z-index: 1;
  }

  .small-desc {
    font-size: 1em;
    font-weight: 400;
    line-height: 1.5em;
    color: #d7d7d7;
    position: relative;
    z-index: 1;
  }

  .go-corner {
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    width: 2em;
    height: 2em;
    overflow: hidden;
    top: 0;
    right: 0;
    background: linear-gradient(135deg, #8a8a8a, #3d3d3d);
    border-radius: 0 4px 0 32px;
    z-index: 2;
  }

  .go-arrow {
    margin-top: -4px;
    margin-right: -4px;
    color: white;
    font-family: courier, sans;
  }

  .card {
    display: block;
    position: relative;
    background-color: #1a1a1a;
    border-radius: 10px;
    padding: 2em 1.8em;
    margin: 12px;
    text-decoration: none;
    z-index: 0;
    overflow: hidden;
    background: linear-gradient(to bottom, #2f2f2f, #1a1a1a);
    font-family: Arial, Helvetica, sans-serif;
    width: calc(100% - 24px);
    height: calc(100% - 24px);
    min-height: 300px;
  }

  .card:before {
    content: '';
    position: absolute;
    z-index: 0;
    top: -16px;
    right: -16px;
    background: #4a4a4a;
    height: 32px;
    width: 32px;
    border-radius: 32px;
    transform: scale(1);
    transform-origin: 50% 50%;
    transition: transform 0.35s ease-out;
  }

  .card:hover:before {
    transform: scale(45);
  }

  .card:hover .small-desc {
    transition: all 0.5s ease-out;
    color: rgba(255, 255, 255, 0.8);
  }

  .card:hover .card-title {
    transition: all 0.5s ease-out;
    color: #ffffff;
  }
`;

export default PromoCard;
