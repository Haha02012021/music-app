<?php

namespace App\Http\Requests\Action;

use App\Http\Requests\CustomRequest;
use Illuminate\Validation\Rule;

class LikeRequest extends CustomRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'item_id' => ['required', 'numeric'],
            'item' => ['required', Rule::in([1, 2])],
        ];
    }
}
