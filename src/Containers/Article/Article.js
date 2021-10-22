import React, {Component} from "react"
import css from "./Article.module.css"
import {markdown} from "markdown";
import markCss from "./Markdown.module.css"
class Article extends Component{

    state = {
        input: "",
        output: ""
    }

    handleInput(e){
        const input = e.target.value
        this.setState({
            ...this.state,
            input,
            output: markdown.toHTML(input),
        })
    }

    handleTab(e){
        if(e.key === "Tab"){
            e.preventDefault();
            let start = e.target.selectionStart;
            let end = e.target.selectionEnd;
            console.log("start, end", start, end)
            console.log("1 part, 2 part", e.target.value.substring(0, start), e.target.value.substring(end))
            const input = e.target.value.substring(0, start) + "\t" + e.target.value.substring(end);
            this.setState({
                input,
                output: markdown.toHTML(input),
            })

            e.target.selectionStart = e.target.selectionEnd = start + 1;
            console.log(this.state)
        }

        // document.getElementById('textbox').addEventListener('keydown', function(e) {
        //     if (e.key == 'Tab') {
        //         e.preventDefault();
        //         var start = this.selectionStart;
        //         var end = this.selectionEnd;
        //
        //         // set textarea value to: text before caret + tab + text after caret
        //         this.value = this.value.substring(0, start) +
        //             "\t" + this.value.substring(end);
        //
        //         // put caret at right position again
        //         this.selectionStart =
        //             this.selectionEnd = start + 1;
        //     }
        // });
    }



    render(){
        return (
            <div className={css.Article}>
                <textarea name="" id="textarea" cols="30" rows="10" value={this.state.input} onKeyDown={this.handleTab.bind(this)} onInput={this.handleInput.bind(this)}/>
                {/*<div className={css.final} >{this.state.output}</div>*/}
                <div className={`${css.final} ${markCss["markdown-body"]}`}
                     dangerouslySetInnerHTML={{__html: this.state.output}}
                />
            </div>
        )
    }
}

export default Article