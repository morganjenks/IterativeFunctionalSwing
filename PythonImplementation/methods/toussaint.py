import numpy as np

def toussaint_method(bufferObject, start_phase=0, end_phase=1, params=None):
    
    # Set defaults for params
    total_steps = params[0] if params and len(params) > 0 else 8
    hits = params[1] if params and len(params) > 1 else 3
    rotation = params[2] if params and len(params) > 2 else 0
    blend = params[3] if params and len(params) > 3 else 0.5

    # Compute total sample count and start/end indices
    start_samp = int(start_phase * len(bufferObject))
    end_samp = int(end_phase * len(bufferObject))
    mutation_magnitude = (end_samp - start_samp) / len(bufferObject)
    print("mutation mag")
    print(mutation_magnitude)

    # Generate a simple Euclidean pattern
    def euc_toussaint(steps, hits, rotation):
        rhythm = np.zeros(steps)
        step = steps / hits
        for i in range(0, hits):
            position = np.round(i * step + rotation) % steps
            print(int(position))
            rhythm[int(position)] = 1
        return rhythm

    # Generate Euclidean rhythm
    euc_pattern = euc_toussaint(total_steps, hits, rotation)

    
    print(euc_pattern)
    # Scale Euclidean pattern to the buffer range
    step_values = np.cumsum(euc_pattern) / sum(euc_pattern) if sum(euc_pattern) > 0 else np.zeros_like(euc_pattern)
    print(step_values)
    # Interpolate step values into the buffer range
    for i in range(start_samp, end_samp):
        
        phase = (i - start_samp) / (end_samp - start_samp)
        step_idx = int(phase * len(step_values))
        step_value = step_values[step_idx]

        parent_step_value = start_phase + (step_value * mutation_magnitude)
        # Linear interpolation with mutation magnitude
        
        bufferObject[i] = blend * parent_step_value + (1 - blend) * bufferObject[i]

    return bufferObject
