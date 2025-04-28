import numpy as np
from methods.helpers import default_values, calculate_sample_range, modulo, remap, blend

def exponent_method(buffer_object, start_phase=0, end_phase=1, params=None):
    if params is None:
        params = []

    # Set up defaults if args are falsy
    freq, exp, alpha = default_values(params, [4,2,0.6])

    total_sample_count, start_samp, end_samp, mutation_magnitude = calculate_sample_range(buffer_object, start_phase, end_phase)

    for i in range(start_samp, end_samp):
        index_in_buffer = modulo(i, total_sample_count)
        existing_sample_value = buffer_object[index_in_buffer]
        expanded_phase = remap(i, start_samp, end_samp, 0, 1) * freq
        step = np.floor(expanded_phase)
        exponent_value = np.power(modulo(expanded_phase, 1.0), exp)
        rescaled_scallop = remap(exponent_value + step, 0, freq, 0, 1)
        poke_value = blend(existing_sample_value, rescaled_scallop, alpha)
        buffer_object[index_in_buffer] = poke_value
