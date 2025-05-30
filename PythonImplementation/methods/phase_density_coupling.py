import numpy as np
from methods.helpers import default_values, calculate_sample_range, modulo, remap, blend, create_array

def phase_density_method(buffer_object, start_phase=0, end_phase=1, params=None):
    if params is None:
        params = []

    # Set defaults
    min_freq, max_freq, min_wake, max_wake, alpha = default_values(params, [0.2, 3, 0.1, 0.4, 0.5])

    total_sample_count, start_samp, end_samp, mutation_magnitude = calculate_sample_range(buffer_object, start_phase, end_phase)


    # Read initial buffer values
    prev_values = buffer_object.copy()

    # Track phase shift across iterations
    global_phase_shift = 0

    # Process buffer samples
    for i in range(start_samp, end_samp):
        index_in_buffer = round(modulo(i, total_sample_count))
        basis = index_in_buffer / total_sample_count

        # Calculate deviation from basis
        initial_deviation = abs(prev_values[index_in_buffer] - basis)

        # Non-linear scaling for deviation
        scaled_deviation = np.power(initial_deviation, 1.5)  # Exponential scaling

        # Calculate offset index
        offset_index = modulo(
            round(
                remap(scaled_deviation, 0, 1, min_wake, max_wake) 
                * total_sample_count
            ), 
            total_sample_count
        )

        # Sample the offset index
        offset_sample = buffer_object[offset_index]
        offset_basis = offset_index / total_sample_count
        offset_deviation = abs(offset_sample - offset_basis)

        # Determine perturbation frequency
        combined_deviation = np.sqrt(initial_deviation * offset_deviation)  # Blend deviations
        perturbation_freq = remap(combined_deviation, 1, 0, min_freq, max_freq)

        # Introduce a global phase drift
        global_phase_shift += (0.01 * combined_deviation)  # Slowly shift phase based on deviation
        drifted_basis = modulo((basis + global_phase_shift), 1)

        # Phase modulation for dynamic behavior
        phase_mod = np.sin(2 * np.pi * drifted_basis) * 0.5 + 0.5  # [0, 1] range
        perturbation_freq *= phase_mod  # Modulate frequency dynamically

        # Calculate perturbation value
        perturbation_value = np.sin(2 * np.pi * perturbation_freq * drifted_basis) * (1 - scaled_deviation)

        # Dynamically adjust alpha blending
        dynamic_alpha = alpha * (1 - combined_deviation)  # Higher deviation = less influence from previous state

        # Add divergence: Use neighbor deviations to vary blending
        neighbor_deviation = abs(prev_values[modulo((index_in_buffer + 1), total_sample_count)] - basis)
        dynamic_alpha += neighbor_deviation * 0.2  # Boost alpha based on neighbor

        # Blend new value
        mixed_sample = blend(prev_values[index_in_buffer], basis + perturbation_value, dynamic_alpha)

        # Write back to buffer
        buffer_object[index_in_buffer] = mixed_sample
