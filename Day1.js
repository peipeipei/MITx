var calculator = (function () {
    
    function calculate(text) {
        //var txt = $('#text');
        //var val = txt.val();
        var pattern = /\d+|\+|\-|\*|\/|\(|\)/g;
        var tokens = text.match(pattern);
        try{
            var val = evaluation(tokens)
            if (tokens.length > 0){
                throw "ill-formed expression";   //throw New Error "message" <-something like that 
            }
            return String(val);
        }
        catch(err)
            
        {
            return err; //as in error message printed as an error
        }
        
        return JSON.stringify(tokens);  
        //return text;
    }
    
    function read_operand(tokens){
        //var num_string = tokens.shift();
        
        var operand_string = tokens.shift();
        if (operand_string == "(") {
            return evaluation(tokens, true);   
        }
        if (operand_string == "-"){
            var negate = read_operand(tokens);
            return 0-negate;
        }
        
        var num = parseInt(operand_string);
        if (isNaN(num)){
            throw "number expect"; 
            }
        else {
            return num; 
            }  
    }
    
    //subexpression is boolean
    //true if evaluating inside ()
    function evaluation(tokens, subexpression){
        subexpression = subexpression || false;
        if (tokens.length == 0){
            throw "missing operand";   
        }
        var value = read_operand(tokens);
        while (tokens.length > 0){
            var operator = tokens.shift();
            if (operator == ")" && subexpression){
                return value;
            }
            if (["+","-","*","/"].indexOf(operator) == -1 ){
                throw "unrecognized operator";
            }
            if (tokens.length == 0){
                throw "missing operand";
            }
            var temp = read_operand(tokens);
            var ops = {"+": function add(x,y){return x+y},
                       "-": function sub(x,y){return x-y},
                       "*": function mul(x,y){return x*y},
                       "/": function divi(x,y){return x/y} };
            value = ops[operator](value,temp);
        }
        return value;
    }
    
    
    function setup(div) {
        var input = $('<input></input>', {type: 'text', size: 50});
        var output = $('<div></div>');
        var button = $('<button>Calculate</button>');
        $(div).append(input,button,output);
        
        button.on('click', function (event) {
            output.text(calculate(input.val()));
        });
    }    
    
    return {
        calculate: calculate, 
        setup: setup 
    };
})();

$(document).ready(function () {
    $('.calc').each(function () {
        calculator.setup(this);
    });
});
