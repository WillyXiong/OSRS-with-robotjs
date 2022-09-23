// import robotjs library
var robot = require('robotjs');

function main() {

    console.log("Starting...");
    sleep(4000);

    // basic infinite loop
    while (true) {
        var tree = findTree();
        // if we cannot find tree, error message
        if (tree == false) {
            rotateCamera();
            continue;
        }

        // chops down tree
        robot.moveMouse(tree.x, tree.y);
        robot.mouseClick();
        sleep(3000);

        dropLogs(); // drops log
    }
}
// drops logs inside the inventory
function dropLogs() {
    // x and y pixel coordinates of the log in the inventory
    var inventory_x = 1755;
    var inventory_y = 795;
    var inventory_log_color = "654723";

    var pixel_color = robot.getPixelColor(inventory_x, inventory_y);

    var wait_cycles = 0;
    var max_wait_cycles = 9;
    while (pixel_color != inventory_log_color && wait_cycles < max_wait_cycles) {
        // wait a little longer if chopping finishes
        sleep(1000);
        // sample the pixel color again after waiting
        pixel_color = robot.getPixelColor(inventory_x, inventory_y);
        // increment our counter
        wait_cycles++;
    }

    // drop logs from inventory if color matches log color
    if (pixel_color == inventory_log_color) {
        robot.moveMouse(inventory_x, inventory_y);
        robot.mouseClick('right');
        sleep(300);
        robot.moveMouse(inventory_x, inventory_y + 35);
        robot.mouseClick();
        sleep(1000);
    }
}

function findTree() {
    // screen size when looking for a tree
    var x = 300, y = 300, width = 1300, height = 400;
    var img = robot.screen.capture(x, y, width, height);

    // used hex colors to locate tree
    var tree_colors = ["78552B", "453019", "7B572B", "715129", "74532A", "624522"];

    // searches for a tree, if tree found cut the tree, if not move game camera until tree found
    for (var i = 0; i < 500; i++) {
        var random_x = getRandomInt(0, width - 1);
        var random_y = getRandomInt(0, height - 1);
        var sample_color = img.colorAt(random_x, random_y);

        if (tree_colors.includes(sample_color)) {
            var screen_x = random_x + x;
            var screen_y = random_y + y;
        
            if (confirmTree(screen_x, screen_y)) {
                console.log("No tree at: " + screen_x + " color: " + sample_color);
             } else {
                console.log("Found a tree at: " + screen_x + " color: " + sample_color);
                return { x: screen_x, y: screen_y };
            }
        }
    }
    
    // did not find tree color
    return false;
}

// rotate camera if there is no tree around
function rotateCamera() {
    console.log("Rotating Camera");
    robot.keyToggle('right', 'down');
    sleep(1000);
    robot.keyToggle('right', 'up');
}

// confirm a tree is found if color is found on top left screen
function confirmTree(screen_x, screen_y) {
    // first move the mouse to the given coordinates
    robot.moveMouse(screen_x, screen_y);
    // wait a moment for text to appear
    sleep(300);

    // now check the color of action
    var check_x = 79;
    var check_y = 33;
    var pixel_color = robot.getPixelColor(check_x, check_y);

    return pixel_color == "00D7D7";
}
// let mouse sleep
function sleep(ms) {
    Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
}
// getting random pixel number to locate tree
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

main();
