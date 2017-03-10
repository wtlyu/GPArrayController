CC= g++

all: GPIOController export unexport capture

GPIOController: GPIOController.cpp jetsonGPIO.o
	${CC} GPIOController.cpp jetsonGPIO.o -o GPIOController

export: export.cpp jetsonGPIO.o
	${CC} export.cpp jetsonGPIO.o -o export

unexport: unexport.cpp jetsonGPIO.o
	${CC} unexport.cpp jetsonGPIO.o -o unexport

capture: capture.cpp jetsonGPIO.o
	${CC} capture.cpp jetsonGPIO.o -o capture

jetsonGPIO.o: jetsonGPIO.c
	${CC} jetsonGPIO.c -c -o jetsonGPIO.o

clean :
	rm GPIOController export unexport capture jetsonGPIO.o
