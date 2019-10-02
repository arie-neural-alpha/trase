import React, { useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import './units-tooltip.scss';

function UnitsTooltip(props) {
  const { className, text, items, show, x, y, height, width } = props;
  const ref = useRef(null);
  const [position, setPosition] = useState({
    left: 0,
    top: 0
  });

  useEffect(() => {
    if (ref.current && typeof x !== 'undefined' && typeof y !== 'undefined') {
      const w = width || document.documentElement.clientHeight;
      const h = height || document.documentElement.clientWidth;

      const canDisplayOnRight = ref.current && x < w - ref.current.clientWidth - 10;
      const canDisplayOnBottom = ref.current && y < h - ref.current.clientHeight - 10;

      const leftPos = canDisplayOnRight ? x + 10 : x - ref.current?.clientWidth - 10;
      const topPos = canDisplayOnBottom ? y + 10 : y - ref.current?.clientHeight - 10;
      const newPosition = {
        left: Number.isNaN(leftPos) ? 0 : leftPos,
        top: Number.isNaN(topPos) ? 0 : topPos
      };
      setPosition(newPosition);
    }
  }, [x, y, width, height, text, setPosition]);

  const visibility = show ? 'visible' : 'hidden';

  return (
    <div
      ref={ref}
      className={cx('c-units-tooltip', className)}
      style={{
        left: position ? position.left : undefined,
        top: position ? position.top : undefined,
        visibility
      }}
    >
      <div className="units-tooltip-text">{text}</div>
      {items.map(item => (
        <div key={item.title} className="units-tooltip-value">
          <div className="units-tooltip-title">{item.title}</div>
          <div className="units-tooltip-data">
            {item.value}
            {item.unit && <span className="units-tooltip-value-unit"> {item.unit}</span>}
          </div>
        </div>
      ))}
    </div>
  );
}

UnitsTooltip.defaultProps = {
  items: []
};

UnitsTooltip.propTypes = {
  className: PropTypes.string,
  x: PropTypes.number,
  y: PropTypes.number,
  height: PropTypes.number,
  width: PropTypes.number,
  text: PropTypes.string,
  items: PropTypes.array,
  show: PropTypes.bool
};

export default React.memo(UnitsTooltip);
