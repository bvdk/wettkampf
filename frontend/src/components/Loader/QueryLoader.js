// @flow
import React from 'react';
import Error from "../Error/index";
import Loader from "./Loader";

type Props = {
  size?: string,
  query: {
    loading: boolean,
    error: any
  },
}

class QueryLoader extends React.Component<Props> {

  render() {

    const { query, size } = this.props;

    if (!query || query.error){
      return <Error error={query ? query.error : null}/>
    }

    if (query.loading){
      return <div className="relative"><Loader size={size}/></div>
    }

    return null;
  }
}

export default QueryLoader;
