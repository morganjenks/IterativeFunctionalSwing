import numpy as np
from methods.helpers import default_values, calculate_sample_range

def toussaint_method(buffer_object, start_phase=0, end_phase=1, params=None):
    
    # Set defaults for params
    total_steps, hits, rotation, blend = default_values(params, [8,3,0,0.5])

    # Compute total sample count and start/end indices
    total_sample_count, start_samp, end_samp, mutation_magnitude = calculate_sample_range(buffer_object, start_phase, end_phase)

    # Generate Euclidean rhythm
    euc_pattern = euc_toussaint(total_steps, hits, rotation)

    # Scale Euclidean pattern to the buffer range
    step_values = np.cumsum(euc_pattern) / sum(euc_pattern) if sum(euc_pattern) > 0 else np.zeros_like(euc_pattern)
    # Interpolate step values into the buffer range
    for i in range(start_samp, end_samp):
        
        phase = (i - start_samp) / (end_samp - start_samp)
        step_idx = int(phase * len(step_values))
        step_value = step_values[step_idx]

        parent_step_value = start_phase + (step_value * mutation_magnitude)
        # Linear interpolation with mutation magnitude
        
        buffer_object[i] = blend * parent_step_value + (1 - blend) * buffer_object[i]

    return buffer_object

# Generate a simple Euclidean pattern
def euc_toussaint(steps, hits, rotation):
    rhythm = np.zeros(steps)
    step = steps / hits
    for i in range(0, hits):
        position = np.round(i * step + rotation) % steps
        rhythm[int(position)] = 1
    return rhythm