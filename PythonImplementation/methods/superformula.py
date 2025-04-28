import numpy as np
from methods.helpers import default_value, default_values, modulo, remap, blend

def superformula_method(buffer_object, start_phase=0, end_phase=1, params=None):
    if params is None:
        params = []
    '''
    # Set defaults
    m1 = default_value(params[0] if len(params) > 0 else None, 4)
    m2 = default_value(params[1] if len(params) > 1 else None, 3)
    n1 = default_value(params[2] if len(params) > 2 else None, 1)
    n2 = default_value(params[3] if len(params) > 3 else None, 1)
    n3 = default_value(params[4] if len(params) > 4 else None, 1)
    a = default_value(params[5] if len(params) > 5 else None, 1)
    b = default_value(params[6] if len(params) > 6 else None, 1)
    alpha = default_value(params[7] if len(params) > 7 else None, 0.5)
    '''

    m1, m2, n1, n2, n3, a, b, alpha = default_values(params, [4, 3, 1, 1, 1, 1, 1, 0.5])
    print("new default values called.")
    total_sample_count = len(buffer_object)
    start_samp = int(start_phase * total_sample_count)
    end_samp = int(end_phase * total_sample_count)

    for i in range(start_samp, end_samp):
        index_in_buffer = modulo(i, total_sample_count)
        current_sample_value = buffer_object[index_in_buffer]
        raw_phase = remap(i, start_samp, end_samp, 0, 1)
        theta = raw_phase * 4 * np.pi

        # Apply the superformula expression
        r = np.power(
            (
                np.power(np.abs(np.cos(m1 * theta / 4)), n2) * a
                + 
                np.power(np.abs(np.sin(m2 * theta / 4)), n3) * b
            ) / (a + b),
            n1
        )

        mapped_radius = remap(r, 0, 1, start_phase, end_phase)
        mod_radius = modulo(mapped_radius, 1.0)

        buffer_object[index_in_buffer] = blend(current_sample_value, mod_radius, alpha)
