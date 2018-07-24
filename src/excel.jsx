import React,{Component} from 'react';
import ReactDOM from 'react-dom';

class Excel extends React.Component{

  constructor(props) {
    super(props);
    this.state = {
      data: props.initialData,
      headers: props.headers,
      edit: null,
      sortby: null,
      descending: false,
    };
    this.handleDoubleClick = this.handleDoubleClick.bind(this);
    this.save = this.save.bind(this);
    this.sort = this.sort.bind(this);
  }

  handleDoubleClick = (e) => {
    this.setState({
      edit: {
        row: parseInt(e.target.dataset.row, 10),
        cell: e.target.cellIndex,
      }
    });
  }

  save = (e) => {
    e.preventDefault();
    var input = e.target.firstChild;
    var data = this.state.data.slice();
    if (this.state.edit.cell == 0) {
      data[this.state.edit.row][this.state.edit.cell] = input.value;
    } else {
      data[this.state.edit.row][this.state.edit.cell] = parseInt(input.value);
    }
    this.setState({data: data, edit: null});
  }

  sort = (e) => {
    const column = e.target.cellIndex;
    let data = this.state.data.slice();
    let descending = this.state.sortby == column && !this.state.descending;
    data.sort((a, b) => {
      return descending
      ? (a[column] < b[column] ? 1 : -1)
      : (a[column] > b[column] ? 1 : -1)
    })
    this.setState({
      data: data,
      sortby: column,
      descending: descending,
    })
  }

  render() {
    return (
      <table>
        <thead onClick={this.sort}>
          <tr>
            {this.state.headers.map(function (title, idx) {
              if (this.state.sortby == idx) {
                title += this.state.descending ? ' \u2191' : ' \u2193';
              }
              return <th key={idx}>{title}</th>;
            },this)
            }
          </tr>
        </thead>
        <tbody onDoubleClick={this.handleDoubleClick}>{
          this.state.data.map(function (row, rowIdx) {
            let sum = 0;
            return (
              <tr key={rowIdx}>
                {row.map(function (cell, idx) {
                  if (idx > 0) {
                    sum += cell;
                  }
                  const add = [];
                  const edit = this.state.edit;
                  if (edit && edit.row == rowIdx && edit.cell == idx) {
                    add.push(<td key={idx} data-row={rowIdx}><form onSubmit={this.save}>
                      <input type="text" defaultValue={cell}/>
                    </form></td>)
                  } else {
                    if (idx == row.length-1) {
                      add.push(<td key={idx} data-row={rowIdx}>{cell}</td>);
                      add.push(<td key={idx+1}>{sum}</td>)
                    } else {
                      add.push(<td key={idx} data-row={rowIdx}>{cell}</td>);
                    }
                  }
                  return add;
                },this)
                }
              </tr>);
          },this)
        }
        </tbody>
      </table>
    );
  }
}

var headers = ["姓名", "语文", "数学", "英语", "总分"];
var data = [
  ["joke", 34, 56, 67],
  ["tom", 56, 78, 88],
  ["jary", 90, 34, 78],
];

ReactDOM.render(
  <Excel headers={headers} initialData={data}/>,
  document.getElementById('excel')
)