import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import getAccessToken from "../../utils/getAccessToken";
import { toast } from "react-toastify";
import Grid from "../../styled/Grid";
import P from "../../styled/P";
import TrackTable from "../TrackTable";

class SearchedTrackList extends Component {
  state = {
    searchList: []
  };
  searchTrack = async searchedTrack => {
    const searchLimit = 40;
    try {
      const access_token = getAccessToken();
      const response = await fetch(
        `https://api.spotify.com/v1/search?q=${searchedTrack}&type=track&market=PL&limit=${searchLimit}`,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
            Accept: "application/json",
            "Content-Type": "application/json"
          }
        }
      );
      const data = await response.json();
      this.setState({ searchList: data.tracks.items });
    } catch (error) {
      toast.error("Sorry couldn't find any tracks. :(");
    }
  };
  componentWillReceiveProps(nextProps) {
    const searchedTrack = nextProps.match.params.searchedTrack;
    this.searchTrack(searchedTrack);
  }
  componentDidMount() {
    const searchedTrack = this.props.match.params.searchedTrack;
    this.searchTrack(searchedTrack);
  }
  render() {
    const { searchList } = this.state;
    const { playTrack } = this.props;
    return (
      <>
        {searchList.length > 0 ? (
          <TrackTable playTrack={playTrack} tracks={searchList} />
        ) : (
            <Grid>
              <P>
                Sorry, couldn't find any tracks.
                <i class="far fa-sad-tear fa-2x" />
              </P>
            </Grid>
          )}
      </>
    );
  }
}

export default withRouter(SearchedTrackList);