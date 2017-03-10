CC= g++

all: processor

processor: processor.cpp
	${CC} processor.cpp -o GPIOController $(pkg-config --cflags --libs opencv)

clean :
	rm processor
