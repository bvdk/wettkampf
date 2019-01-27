import React from 'react';
import {NavLink} from 'react-router-dom';
import withBreadcrumbs from 'react-router-breadcrumbs-hoc';
import {Breadcrumb} from "antd";
import EventBreadcrumb from "./event";
import AthleteBreadcrumb from "./athlete";

// define some custom breadcrumbs for certain routes (optional)
const routes = [
  { path: '/events/:eventId/athletes/new', breadcrumb: 'Neu' },
  { path: '/events/:eventId/athletes/import', breadcrumb: 'Import' },
  { path: '/events/:eventId/athletes/:athleteId', breadcrumb: AthleteBreadcrumb },
  { path: '/events/:eventId/live', breadcrumb: 'LIVE' },
  { path: '/events/:eventId/judging', breadcrumb: 'Wertung' },
  { path: '/events/:eventId/athletes', breadcrumb: 'Athleten' },
  { path: '/events/:eventId/officals', breadcrumb: 'Kampfrichter' },
  { path: '/events/:eventId', breadcrumb: EventBreadcrumb },
  { path: '/events', breadcrumb: 'Wettkämpfe' },
  { path: '/', breadcrumb: 'BVDK' },
];

// map & render your breadcrumb components however you want.
// each `breadcrumb` has the props `key`, `location`, and `match` included!
const RouterBreadcrumbs = ({ breadcrumbs }) => (
  <Breadcrumb style={{ margin: '16px 0' }}>
    {breadcrumbs.map((breadcrumb, index) => (
      <Breadcrumb.Item key={breadcrumb.key}>
        <NavLink to={breadcrumb.props.match.url}>
          {breadcrumb}
        </NavLink>
      </Breadcrumb.Item>
    ))}
  </Breadcrumb>
);


export default withBreadcrumbs(routes)(RouterBreadcrumbs);
