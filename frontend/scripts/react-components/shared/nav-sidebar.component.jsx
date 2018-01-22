import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'redux-first-router-link';

const NavSidebar = (props) => {
  const { links } = props;

  const mapLinksToRouter = link => (
    typeof link.page === 'string'
      ? ({ ...link, page: { type: link.page, payload: {} } })
      : link
  );

  const isActive = (match, location, link) => console.log(match, location, link) || (
    (location.type === link.page.type && link.page.payload.section === location.payload.section)
  );

  return (
    <div className="c-nav-sidebar">
      <ul className="nav-sidebar-link-list">
        {
          links.map(mapLinksToRouter)
            .map(link => (
              <li key={link.name} className="nav-sidebar-link-list-item">
                <NavLink
                  exact
                  strict
                  to={link.page}
                  className="subtitle -gray"
                  activeClassName="-pink"
                  isActive={(...params) => isActive(...params, link)}
                >
                  {link.name}
                </NavLink>
              </li>
          ))
        }
      </ul>
    </div>
  );
};

NavSidebar.propTypes = {
  links: PropTypes.array
};

export default NavSidebar;
