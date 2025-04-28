import numpy as np
from methods.helpers import default_values, calculate_sample_range

def saw_method(buffer_object, start_phase=0, end_phase=1, params=None):
    freq, blend = default_values(params, [1, 1])

    total_sample_count, start_samp, end_samp, mutation_magnitude = calculate_sample_range(buffer_object, start_phase, end_phase)

    for i in range(start_samp, end_samp):
        local_phase = (freq * i / (end_samp - start_samp)) % 1
        parent_phase = start_phase + (local_phase * mutation_magnitude)
        buffer_object[i] = blend * parent_phase + (1 - blend) * buffer_object[i]
