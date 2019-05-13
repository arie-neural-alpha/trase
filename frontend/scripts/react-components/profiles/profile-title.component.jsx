import React from 'react';
import PropTypes from 'prop-types';
import snakeCase from 'lodash/snakeCase';
import _template from 'lodash/template';

function ProfileTitle(props) {
  const { template, summary, year, commodityName } = props;
  function substitute(part) {
    const interpolate = /{{([\s\S]+?)}}/g;
    const params = {
      ...summary,
      year,
      commodityName,
      companyName: summary.nodeName
    };
    const snakeCasedParams = Object.entries(params).reduce((acc, [key, value]) => ({
      ...acc,
      [snakeCase(key)]: value
    }));
    const compiled = _template(part, { interpolate });
    return compiled(snakeCasedParams);
  }

  if (!template) {
    return null;
  }

  return template.split(' ').map((part, i) => {
    const hasMustache = /^.*{{.+}}.*$/.test(part);
    const mustache = hasMustache && (
      <span key={part} className="notranslate">
        {substitute(part)}
      </span>
    );
    if (i > 0) {
      if (hasMustache) {
        return (
          <>
            {' '}
            {mustache}
            {}
          </>
        );
      }
      return ` ${part}`;
    }
    return hasMustache ? mustache : part;
  });
}

ProfileTitle.propTypes = {
  template: PropTypes.string.isRequired,
  summary: PropTypes.object.isRequired
};

export default React.memo(ProfileTitle);