import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props){
    // return(
    //     <button className = 'square' onClick = {props.onClick}>
    //         {props.value}
    //     </button>
    // );
    return (props.winnerLocation) ? (
        <button className="square square-highlight" onClick={props.onClick}>
          {props.value}
        </button>
      ) : (
        <button className="square" onClick={props.onClick}>
          {props.value}
        </button>  
      )  ;
}
class Board extends React.Component{
    renderSquare(i){
        return (<Square 
                    value = {this.props.squares[i]}
                    onClick = {() => this.props.onClick(i)}
                />);
    }
    render(){
        const matrixSize = Math.sqrt(this.props.squares.length);
        const rows = Array(matrixSize).fill(null);
        const cols = rows;
        const board = rows.map((rows, i) => {
            const squares = cols.map((cols, j)=>{
                const squaresKey = i * matrixSize +j;
                return <span key = {squaresKey}>{this.renderSquare(squaresKey)}</span>
            });
            return <div className = 'board-row' key = {i}>{squares}</div>
        });
        return(
            <div>
                {board}
            </div>
        );
    }
}

class Game extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            history : [{
                squares : []
            }],
            stepNumber : 0,
            isNext : true,
            size : 3,
            name1: '',
            name2: '',
            array_win:[],
            tran:1,
            bo:1,
            step_to_win: 3,
            isWinIngame : false,
            winnerLocation: []
        };
    }
    gameConfig = (state) => {
        var array_win= []
        this.setState({ 
            size: state.size,
            history: [{
                squares : Array(parseInt(state.size)*parseInt(state.size)).fill(null)
            }],
            name1: state.name1,
            name2: state.name2,
            step_to_win:state.step_to_win,
            bo: state.bo,
            array_win: array_win

        })
    }
    create_line_win(line_size,index){
        const {size} = this.state
        var vertical = []
        var Horizontal = []
        var left_diagonal = []
        var right_diagonal = []
        var row_index = Math.floor(index/size) 
        var col_index = index%size
        for (let i = -(line_size-1); i <= (line_size-1); i++) {
           if((index+i*size)<=(size*size-1)&&(index+i*size)>=0){
            if((i)!=0){
                vertical.push(index+i*size)         
                }else{
                    vertical.push(index)
                }
           }
           if(((row_index+i)>=0&&(col_index+i)>=0)&&(row_index+i)<=size-1&&(col_index+i)<=size-1){
            if((i)!=0){
                left_diagonal.push(((row_index+i)*size)+col_index+i)
                }else{
                   left_diagonal.push(index)
                }
           }
           if(((row_index+i)>=0&&(col_index-i)>=0)&&(row_index+i)<=size-1&&(col_index-i)<=size-1){
            if((i)!=0){
                right_diagonal.push(((row_index+i)*size)+(col_index-i))
                }else{
                    right_diagonal.push(index)
                }
           }           
        }
        for (let i = col_index-(line_size-1); i <= col_index + (line_size-1) ; i++) {
            if(i>=0&&i<=size-1){
                if((index+(i-col_index))!=index){
                    Horizontal.push(index+(i-col_index))
                }else{
                    Horizontal.push(index)
                }
           }
        }
        return {
            vertical:vertical.length>=line_size?vertical:null,
            Horizontal:Horizontal.length>=line_size?Horizontal:null,
            left_diagonal:left_diagonal.length>=line_size?left_diagonal:null,
            right_diagonal:right_diagonal.length>=line_size?right_diagonal:null
        }
    }
    count(square,array,value,line_size){
        var count = 0
        for (let i = 0; i < array.length; i++) {
            if(square[array[i]]==value){
                count += 1
            }else{
                count = 0
            }
            if(count==line_size){
                return true
            }
        }
        return false
    }
    check_chung_cuoc(){
        var count1 = 0
        var count2 = 0
        for (let i = 0; i < this.state.array_win.length; i++) {
            if(this.state.array_win[i]==this.state.name1){
                count1 = count1 + 1
            }
            if(this.state.array_win[i]==this.state.name2){
                count2 = count2 + 1
            }            
        }
        if(count1>=Math.floor(this.state.bo/2)+1){
            return this.state.name1
        }
        if(count2>=Math.floor(this.state.bo/2)+1){
            return this.state.name2
        }
        return false
    }
    checkWinner_(index){
        const square = this.state.history[ this.state.history.length - 1].squares;
        const obj = this.create_line_win(this.state.step_to_win,index)
        if(obj.vertical){
            if(this.count(square,obj.vertical,square[index],this.state.step_to_win)){
                this.setState({
                    winner:(!this.state.isNext?this.state.name1:this.state.name2) + " Win",
                    array_win:[...this.state.array_win,!this.state.isNext?this.state.name1:this.state.name2],
                    isWinIngame:true,
                },()=>{
                    if(this.check_chung_cuoc()){
                        this.setState({finish:this.check_chung_cuoc() + " Win"})
                    }
                })                
            }
        }
        if(obj.Horizontal){
            if(this.count(square,obj.Horizontal,square[index],this.state.step_to_win)){
                this.setState({
                    winner:(!this.state.isNext?this.state.name1:this.state.name2) + " Win",
                    array_win:[...this.state.array_win,!this.state.isNext?this.state.name1:this.state.name2],
                    isWinIngame:true
                },()=>{
                    if(this.check_chung_cuoc()){
                        this.setState({finish:this.check_chung_cuoc() + " Win"})
                    }
                })
            }
        }
        if(obj.left_diagonal){
            if(this.count(square,obj.left_diagonal,square[index],this.state.step_to_win)){
                this.setState({
                    winner:(!this.state.isNext?this.state.name1:this.state.name2) + " Win",
                    array_win:[...this.state.array_win,!this.state.isNext?this.state.name1:this.state.name2],
                     isWinIngame:true
                },()=>{
                    if(this.check_chung_cuoc()){
                        this.setState({finish:this.check_chung_cuoc() + " Win"})
                    }
                })
            }           
        }
        if(obj.right_diagonal){
            if(this.count(square,obj.right_diagonal,square[index],this.state.step_to_win)){
                this.setState({
                    winner:(!this.state.isNext?this.state.name1:this.state.name2) + " Win",
                    array_win:[...this.state.array_win,!this.state.isNext?this.state.name1:this.state.name2],
                    isWinIngame:true
                },()=>{
                    if(this.check_chung_cuoc()){
                        this.setState({finish:this.check_chung_cuoc() + " Win"})
                    }
                })               
            }
        }
    }
    handleClick(i){
        const history = this.state.history.slice(0, this.state.stepNumber +1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if(!this.state.winner){
            if(squares[i]){
                return
            }
            squares[i] = this.state.isNext ? 'X' : 'O';   
            this.setState({
                history : history.concat([{
                    squares : squares
                }]),
                stepNumber : history.length,
                isNext : !this.state.isNext,
            },()=>{
                this.checkWinner_(i)
            });  
        }       
    }
    async jumpTo(step){
        console.log(this.state.isWinIngame);
        console.log(this.state.array_win);
        
        
      if(this.state.isWinIngame == true){
          const {array_win}=this.state;
          if(array_win.length==1){
              this.setState({
                  array_win:[]
              })
          }
        else  this.setState({
                array_win:this.state.array_win.splice(array_win.length -2,1),
                isWinIngame:false
            })
        }
        this.setState({
            stepNumber : step,
            isNext : (step % 2) === 0,
            winner:null,
            finish : null
           
        })
      
    }
    next_game(name_win){
        // this.jumpTo(0)
        this.setState({
            history:[{squares : Array(parseInt(this.state.size)*parseInt(this.state.size)).fill(null)}],
            winner:null,
            tran:this.state.tran+1,
            isWinIngame:false
        })
    }
    render(){
        const history = this.state.history;
        const current = history[this.state.stepNumber] ? history[this.state.stepNumber] : history[0];
        const moves = history.map((step, move) => {
            const desc = move ? 'go to move #' + move : 'go to game start';
            return(
                <li key = {move}>
                    <button onClick = {() => this.jumpTo(move)}>{desc}</button>
                </li>
            );
        });
        let status;
        if (this.state.winner) {
            status = this.state.winner
        } else if(this.state.stepNumber === this.state.size*this.state.size){
            status = 'Draws!!';
        } 
        else {
            status = "Next Player " + (this.state.isNext ? this.state.name1 : this.state.name2);
        }
        return(
            <div className = 'game'>
                <div className = 'game-input'>
                    <NameForm config={(size)=>{
                        this.gameConfig(size)}} />
                </div>
                <div className = 'game-board'>
                    <Board
                    squares = {current.squares}
                    onClick = {(i) => this.handleClick(i)} 
                    />
                </div>
                <div className = 'game-info'>
                    {
                        this.state.winner && this.state.tran < this.state.bo && !this.state.finish
                            ?
                            <button onClick={()=>this.next_game(this.state.winner)}>tran tiep theo</button>
                            :
                            null
                    }                   
                    <div>{status}</div>
                    <ol>{moves}</ol>                   
                </div>
                <div className = 'game-bo'>
                    {
                        this.state.array_win.map((value,index)=>{
                            if(value){
                                return(
                                    <div key = {index}> Tran {index+1} <strong>{value?value:''}</strong> win</div>
                                )
                            }                          
                        })
                    }
                    {
                        this.state.finish
                            ?
                            <div className = 'finish'>{this.state.finish}</div>
                            :
                            null
                    }
                </div>
            </div>
        );
    }
}
class NameForm extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            name1 : '',
            name2 : '',
            size : 0,
            step_to_win:3,
            bo : 1
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChangeBo = this.handleChangeBo.bind(this);
        this.handleChangeStepToWin = this.handleChangeStepToWin.bind(this);

    }
    handleChangeBo(e){
        this.setState({
            bo : e.target.value
        });  
    }
    handleChangeStepToWin(e){
        this.setState({
            step_to_win: e.target.value
        });
    }
    handleChange(e){        
        let nameE = e.target.name;
        switch (nameE) {
            case 'name1':
                this.setState({
                    name1: e.target.value
                })
                break;
            case 'name2':
                this.setState({
                    name2: e.target.value
                })
                break;        
            case 'size': 
                this.setState({
                    size: e.target.value
                })
                break;
            case 'step_to_win': 
                this.setState({
                    step_to_win: e.target.value
                })  
                   break;        
            default:
                break;
        }
    }
    handleSubmit(e){
        this.props.config(this.state);
        e.preventDefault();
    }
    render(){
        return(
            <form className="form-inline" onSubmit = {this.handleSubmit}>
                    <input type="number" placeholder='Size board' onChange = {this.handleChange} name='size' required/>&nbsp;
                    <select onClick = {this.handleChangeStepToWin}>
                        <option value="3">Step 3</option>
                        <option value="4">Step 4</option>
                        <option value="5">Step 5</option>
                    </select>&nbsp;
                    <select onClick = {this.handleChangeBo}>
                        <option value="1">Bo1</option>
                        <option value="3">Bo3</option>
                        <option value="5">Bo5</option>
                        <option value="7">Bo7</option>
                    </select>&nbsp;
                    <input type="text" placeholder='Player 1' name = 'name1' required
                        value = {this.state.name1} onChange = {this.handleChange} />&nbsp;
                    <input type="text" placeholder='Player 2' name = 'name2' required
                        value = {this.state.name2} onChange = {this.handleChange} />&nbsp;
                <button type="submit" className="btn">Submit</button>
            </form>
        );
    }
}
ReactDOM.render(
    <Game />,
    document.getElementById('root')  
);