import numpy as np
from methods.helpers import default_values, calculate_sample_range

def bjorklund_method(buffer_object, start_phase=0, end_phase=1, params=None):
    # Set defaults for params
    total_steps, hits, rotation, blend = default_values(params, [8,3,0,0.5])

    # Compute total sample count and start/end indices
    total_sample_count, start_samp, end_samp, mutation_magnitude = calculate_sample_range(buffer_object, start_phase, end_phase)

    # Generate Euclidean rhythm
    euc_pattern = euc_bjorklund(total_steps, hits)

    # Apply rotation
    euc_pattern = euc_pattern[-rotation:] + euc_pattern[:-rotation]
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
def euc_bjorklund(steps, hits):
    """Bjorklund's algorithm for Euclidean rhythms."""
    if hits == 0:
        return [0] * steps
    if hits == steps:
        return [1] * steps

    pattern = []
    counts = []
    remainders = [hits]
    divisor = steps - hits
    level = 0

    while remainders[level] > 1:
        counts.append(divisor // remainders[level])
        remainders.append(divisor % remainders[level])
        divisor = remainders[level]
        level += 1
    counts.append(divisor)

    def build(level):
        if level == -1:
            pattern.append(0)
        elif level == -2:
            pattern.append(1)
        else:
            for _ in range(counts[level]):
                build(level - 1)
            if remainders[level] != 0:
                build(level - 2)

    build(level)
    return pattern
