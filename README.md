# Functional Iterative Swing

## Iterative Mutation of Sequencer Phase Ramps

This repository presents implementations in Max/MSP js, and Python of a modular iteration strategy for manipulating a sequencer ramp. Presented at ICMC 2025, the paper is available [here](https://github.com/morganjenks/IterativeFunctionalSwing.git)

This approach builds on the concepts of general circle maps[[1]](https://link.springer.com/chapter/10.1007/978-3-030-70210-6_44) and functional iteration synthesis[[2]](https://direct.mit.edu/leon/article-abstract/34/3/249/44078/Iterated-Nonlinear-Functions-as-a-Sound-Generating?redirectedFrom=fulltext) and decouples the timing ramp from event patterns. It encapsulates the circle map's modulation term as a variable for sequential transformations, here with a small set of example modulations. The method is applicable for conventional rhythmic values, compound meter, and poly-rhythmic swing, as well as arbitrary step counts and more extreme manipulations of time. 