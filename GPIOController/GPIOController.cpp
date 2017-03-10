// exampleApp.c

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <termios.h>
#include <time.h>
#include <sys/time.h>
#include <iostream>
#include <string>
#include <unistd.h>
#include "jetsonGPIO.h"
using namespace std;

int getkey() {
    int character;
    struct termios orig_term_attr;
    struct termios new_term_attr;

    /* set the terminal to raw mode */
    tcgetattr(fileno(stdin), &orig_term_attr);
    memcpy(&new_term_attr, &orig_term_attr, sizeof(struct termios));
    new_term_attr.c_lflag &= ~(ECHO|ICANON);
    new_term_attr.c_cc[VTIME] = 0;
    new_term_attr.c_cc[VMIN] = 0;
    tcsetattr(fileno(stdin), TCSANOW, &new_term_attr);

    /* read a character from the stdin stream without blocking */
    /*   returns EOF (-1) if no character is available */
    character = fgetc(stdin);

    /* restore the original terminal attributes */
    tcsetattr(fileno(stdin), TCSANOW, &orig_term_attr);

    return character;
}

int main(int argc, char *argv[]){

    cout << "Testing the GPIO Pins" << endl;


    jetsonTX1GPIONumber IO1 = gpio37 ;
    jetsonTX1GPIONumber IO2 = gpio36 ;

    gpioExport(IO2) ;
    gpioExport(IO1) ;

    gpioSetDirection(IO1,outputPin) ;
    gpioSetDirection(IO2,outputPin) ;
    
/*    cout << "Power On" << endl;

    gpioSetValue(IO2, on);
    usleep(3000000); // sleep for a millisecond
    gpioSetValue(IO2, low);
    
    cout << "Mode" << endl;

    usleep(1500000); // sleep for a millisecond
    gpioSetValue(IO2, on);
    usleep(1500000); // sleep for a millisecond
    gpioSetValue(IO2, low);

    cout << "Enter" << endl;

    usleep(1500000); // sleep for a millisecond
    gpioSetValue(IO1, on);
    usleep(1500000); // sleep for a millisecond
    gpioSetValue(IO1, low);

    while(getkey() != 27) {
        usleep(1000); // sleep for a millisecond
    gpioSetValue(IO1, off);
    }
*/
    char t;
    while((t = getkey()) != 27) {
	if (t == ' '){
	    gpioSetValue(IO1, on);
	    usleep(1500000); // sleep for a millisecond
	    gpioSetValue(IO1, low);
	}
        usleep(1000); // sleep for a millisecond
    }
    cout << "GPIO example finished." << endl;
    gpioUnexport(IO1);     // unexport the LED
    gpioUnexport(IO2);      // unexport the push button

/*
    jetsonTX1GPIONumber redLED = gpio219 ;     // Ouput
    jetsonTX1GPIONumber pushButton = gpio38 ; // Input
    // Make the button and led available in user space
    gpioExport(pushButton) ;
    gpioExport(redLED) ;
    gpioSetDirection(pushButton,inputPin) ;
    gpioSetDirection(redLED,outputPin) ;
    // Reverse the button wiring; this is for when the button is wired
    // with a pull up resistor
    // gpioActiveLow(pushButton, true);


    // Flash the LED 5 times
    for(int i=0; i<5; i++){
        cout << "Setting the LED on" << endl;
        gpioSetValue(redLED, on);
        usleep(200000);         // on for 200ms
        cout << "Setting the LED off" << endl;
        gpioSetValue(redLED, off);
        usleep(200000);         // off for 200ms
    }

    // Wait for the push button to be pressed
    cout << "Please press the button! ESC key quits the program" << endl;

    unsigned int value = low;
    int ledValue = low ;
    // Turn off the LED
    gpioSetValue(redLED,low) ;
    while(getkey() != 27) {
        gpioGetValue(pushButton, &value) ;
        // Useful for debugging
        // cout << "Button " << value << endl;
        if (value==high && ledValue != high) {
            // button is pressed ; turn the LED on
            ledValue = high ;
            gpioSetValue(redLED,on) ;
        } else {
            // button is *not* pressed ; turn the LED off
            if (ledValue != low) {
                ledValue = low ;
                gpioSetValue(redLED,off) ;
            }

        }
        usleep(1000); // sleep for a millisecond
    }

    cout << "GPIO example finished." << endl;
    gpioUnexport(redLED);     // unexport the LED
    gpioUnexport(pushButton);      // unexport the push button

*/
    return 0;
}


