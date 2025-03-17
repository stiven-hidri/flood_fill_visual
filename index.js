let matrix_board = []
let mouseDown = 0
let floodFillDFS = 0
let floodFillBFS = 0

let colors = {
    0: 'white',
    1: 'black',
    2: "red",
    3: 'green',
    4: "orange",
}

let cur_color = 1;

function sleep(milliseconds) {
	return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

window.onload = function() {
    document.getElementById('btn_generate_board').addEventListener("click", generate_board);
    
    buttons_colors = document.getElementsByClassName("color_picker")
    for (let i = 0; i < buttons_colors.length; i++) {
        buttons_colors[i].addEventListener("click", (event) => {
            c = parseInt(event.target.id.split("_")[1])
            cur_color = c;

            document.getElementById("lbl_curcolor").innerHTML = "Current color: " + colors[cur_color];
            document.getElementById("lbl_curcolor").style.color = colors[cur_color];
        });
    }

    document.getElementById('btn_flood_fill_dfs').addEventListener("click", (event) => {
        event.target.classList.toggle("activate");
        enter_flood_fill_mode()
        floodFillDFS = 1;
    });
    
    document.getElementById('btn_flood_fill_bfs').addEventListener("click", (event) => {
        event.target.classList.toggle("activate");
        enter_flood_fill_mode()
        floodFillBFS = 1;
    });

    generate_board();
};

function enter_flood_fill_mode() {
    document.getElementsByTagName("td")
    cells = document.getElementsByTagName("td");
    for (let i = 0; i < cells.length; i++) {
        removeCellEventListeners(cells[i]);
        document.body.style.cursor = "crosshair"
        cells[i].addEventListener("click", floodFill);
    }
}

let directions = [[0, 1], [0, -1], [1, 0], [-1, 0]];

async function flood_fill_depth(cur_i, cur_j, reference) {
    if (matrix_board[cur_i][cur_j] == cur_color) return;

    stack = [[cur_i, cur_j]]
    
    while (stack.length > 0) {
        let [i, j] = stack.pop()
        
        if (!(i < matrix_board.length && i >= 0 && j < matrix_board[0].length && j >= 0 && matrix_board[i][j] == reference)) 
            continue;
        
        matrix_board[i][j] = cur_color;
        document.getElementById(i + "_" + j).style.backgroundColor = colors[cur_color];

        for (let [dx, dy] of directions)
            stack.push([i + dx, j + dy]);

        await new Promise(resolve => setTimeout(resolve, 10));
    }
}

async function flood_fill_breadth(cur_i, cur_j, reference) {
    if (matrix_board[cur_i][cur_j] == cur_color) return;

    stack = [[cur_i, cur_j]]

    while (stack.length > 0) {
        let [i, j] = stack.shift()

        for (let [dx, dy] of directions) {
            new_i = i + dx;
            new_j = j + dy;

            if (new_i < matrix_board.length && new_i >= 0 && new_j < matrix_board[0].length && new_j >= 0 && matrix_board[new_i][new_j] == reference) {
                stack.push([new_i, new_j]);
                matrix_board[new_i][new_j] = cur_color;
                document.getElementById(new_i + "_" + new_j).style.backgroundColor = colors[cur_color];
            }
        }

        await new Promise(resolve => setTimeout(resolve, 10));
    }
}

function floodFill(event) {
    i = parseInt(event.target.id.split("_")[0]);
    j = parseInt(event.target.id.split("_")[1])
    
    if (floodFillDFS) {
        flood_fill_depth(i, j, matrix_board[i][j]);
    } else {
        flood_fill_breadth(i, j, matrix_board[i][j]);
    }

    for (let i = 0; i < cells.length; i++) {
        cells[i].removeEventListener("click", floodFill);
        addCellEventListeners(cells[i]);
        document.body.style.cursor = "pointer"
    }

    if (floodFillBFS)
        document.getElementById('btn_flood_fill_bfs').classList.toggle("activate");
    else
        document.getElementById('btn_flood_fill_dfs').classList.toggle("activate");

    floodFillDFS = 0;
    floodFillBFS = 0
}

function generate_board() {
    let size = parseInt(document.getElementById('input_size').value);

    board = document.getElementById("board");
    board.innerHTML = "";

    matrix_board = new Array(size);
    for (let i = 0; i < size; i++) {
        let row = document.createElement("tr");
        for (let j = 0; j < size; j++) {
            let cell = document.createElement("td");
            cell.id = i + "_" + j;

            addCellEventListeners(cell);
            row.appendChild(cell);
        }

        matrix_board[i] = new Array(size).fill(0);

        board.appendChild(row)
    }
}

function interact_cell(event) {
    let [i, j] = event.target.id.split("_");
    matrix_board[i][j] = cur_color;
    event.target.style.backgroundColor = colors[cur_color];
}

function addCellEventListeners(cell) {
    cell.addEventListener("mousedown", mousedown);
    cell.addEventListener("mouseover", mouseover);
    cell.addEventListener("mouseup", mouseup);
}

function removeCellEventListeners(cell) {
    cell.removeEventListener("mousedown", mousedown);
    cell.removeEventListener("mouseover",  mouseover);
    cell.removeEventListener("mouseup", mouseup);
}

function mousedown(event) {
    mouseDown = true;
    interact_cell(event) 
}

function mouseover(event) {
    if (mouseDown) {
        interact_cell(event) 
    }
}

function mouseup(event) {
    mouseDown = false;
}
