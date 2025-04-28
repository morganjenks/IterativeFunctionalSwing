import numpy as np
from methods.helpers import default_values, modulo, remap, blend, create_array, min_max_of_array

def bresenham_method(buffer_object, start_phase=0, end_phase=1, params=None):
    if params is None:
        params = []

    # Set up defaults if not given
    steps, hits, rotation, alpha = default_values(params, [1,2,0,0.5])

    total_sample_count = len(buffer_object)
    start_samp = int(start_phase * total_sample_count)
    end_samp = int(end_phase * total_sample_count)
    mutation_magnitude = (end_samp - start_samp) / total_sample_count

    print(f"mutation magnitude: {mutation_magnitude}")

    euc_ramp = euc_bresenham(steps, hits, rotation)

    minmax = min_max_of_array(euc_ramp)
    print(f"minmax::: {minmax}")
    min_val, max_val = minmax['min'], minmax['max']

    print(f"{min_val} {max_val} min/max")

    for i in range(start_samp, end_samp):
        index_in_buffer = modulo(i, total_sample_count)
        phase_in_euclid = remap(i, start_samp, end_samp, 0, 1)
        step = int(phase_in_euclid * len(euc_ramp))
        value = euc_ramp[step]
        existing_sample = buffer_object[index_in_buffer]
        buffer_object[index_in_buffer] = blend(existing_sample, value, alpha)

def euc_bresenham(steps, hits, rotation):
    slope = hits / steps
    result = create_array(steps, 0)
    for i in range(steps):
        current = np.floor(i * slope) / hits
        result[i] = current
    return result
