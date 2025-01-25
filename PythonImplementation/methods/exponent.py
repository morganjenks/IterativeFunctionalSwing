import numpy as np
from methods.helpers import default_value, calculate_sample_range, modulo, remap, blend

def exponent_method(buffer_object, start_phase=0, end_phase=1, params=None):
    if params is None:
        params = []

    # Set up defaults if args are falsy
    freq = default_value(params[0] if len(params) > 0 else None, 4)
    exp = default_value(params[1] if len(params) > 1 else None, 2)
    alpha = default_value(params[2] if len(params) > 2 else None, 0.6)

    total_samps = len(buffer_object)
    start_samp = int(start_phase * total_samps)
    end_samp = int(end_phase * total_samps)

    for i in range(start_samp, end_samp):
        index_in_buffer = modulo(i, total_samps)
        existing_sample_value = buffer_object[index_in_buffer]
        expanded_phase = remap(i, start_samp, end_samp, 0, 1) * freq
        step = np.floor(expanded_phase)
        exponent_value = np.power(modulo(expanded_phase, 1.0), exp)
        rescaled_scallop = remap(exponent_value + step, 0, freq, 0, 1)
        poke_value = blend(existing_sample_value, rescaled_scallop, alpha)
        buffer_object[index_in_buffer] = poke_value
