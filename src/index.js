import React from 'react';

class VirtualList extends React.Component {
  mainWrapperRef = React.createRef();
  virtualWrapperRef = React.createRef();

  state = {
    virtualWrapperHeight: this.props.list.length * this.props.rowHeight,
    start: 0,
    numOfVisibleRows: 0,
    arrayList: [],
  }

  componentDidMount() {
    const { rowHeight } = this.props;
    const mainWrapper = this._getRect(this.mainWrapperRef.current);
    this.setState({
      numOfVisibleRows: Math.ceil(mainWrapper.height / rowHeight),
    }, () => this.setState({arrayList: Array.from(Array(this.state.numOfVisibleRows), (x, index) => index + 1)}));

    this.mainWrapperRef.current.addEventListener('scroll', this._scrollListener);
  }

  _getRect = el => el.getBoundingClientRect();

  _scrollListener = async () => {
    const { rowHeight } = this.props;
    const vWrapper = await this._getRect(this.virtualWrapperRef.current);
    const startRow = Math.abs(Math.floor(Math.abs(vWrapper.top) / rowHeight));

    this.setState({
      start: startRow,
    });
  };

  render() {
    const { wrapperStyle, list, listItem, rowHeight } = this.props;
    const { start, virtualWrapperHeight, numOfVisibleRows, arrayList } = this.state;

    return (
      <div style={wrapperStyle} ref={this.mainWrapperRef}>
        <div ref={this.virtualWrapperRef} id="virtualWrapper" style={{ height: `${virtualWrapperHeight}px`}}>
        {arrayList.map((n, k) => listItem(start + k, k, { transform: `translateY(${rowHeight * (start + k)}px)` }))}
        </div>
      </div>
    );
  }
}

export default VirtualList;
        // {list.map((v, k) => k >= start && k <= (start + numOfVisibleRows) && listItem(v, k, { transform: `translateY(${rowHeight * k}px)` }))}
