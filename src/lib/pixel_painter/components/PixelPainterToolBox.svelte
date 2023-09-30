<script lang="ts">
  import { fly, slide } from "svelte/transition";
  import painter, { Actions } from "../stores/pixelPainterStore";
  import { SnackbarType, snackbars } from "$lib/snackbar";
  import { COLORS, color } from "../stores/painterToolBoxStores";
  import RangeInput from "./RangeInput.svelte";
  import DragIndicator from "$lib/symbols/DragIndicator.svelte";
  import Close from "$lib/symbols/Close.svelte";
  import Check from "$lib/symbols/Check.svelte";
  import DragPan from "$lib/symbols/DragPan.svelte";
  import InkEraser from "$lib/symbols/InkEraser.svelte";
  import ToolButton from "./ToolButton.svelte";
  import { center, focusOnMount } from "../actions";
  import Desc from "$lib/translation/Desc.svelte";

  let colorsExpanded = false;
  let dragButton: HTMLSpanElement;
  let dragging = false;
  let position = { x: 0, y: -100 };
  let saving = false;
  let action: Actions = Actions.Draw;
  let brushSize = 0;

  $: {
    painter.update((painter) => painter.setAction(action));
  }
  $: {
    painter.update((painter) =>
      painter.setPainterContext({ color: $color.color, size: brushSize })
    );
  }
  $: if (action === "move") {
    painter.update((painter) => {
      painter.canvas.style.cursor = "grab";
      return painter;
    });
  } else {
    painter.update((painter) => {
      painter.canvas.style.cursor = "default";
      return painter;
    });
  }

  const calculateNewPosition = (xPos: number, yPos: number) => {
    const { width, height } = dragButton.getBoundingClientRect();
    const newXPos = xPos - width / 2;
    const newYPos = yPos - height / 2;
    return { x: newXPos, y: newYPos };
  };

  const handleSave = async () => {
    const cells = $painter.cellBoard.toRawColorsString();
    saving = true;
    const res = await fetch("api/painter", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ cells }),
    });
    if (res.ok) {
      snackbars.add("Saved!", {
        type: SnackbarType.success,
        detail: "Your art will be visible after verification.",
      });
    } else {
      snackbars.add("Failed to save", {
        detail: (await res.json()).message || "Please try again later.",
      });
    }
    setTimeout(() => (saving = false), 5000);
  };

  const handleClearAllClick = () => {
    $painter.reset();
    action = Actions.Draw
  };

  const handleEraseClick = () => {
    if (action === "erase") {
      action = Actions.Draw;
    } else {
      action = Actions.Erase;
    }
  };

  const handleMoveClick = () => {
    if (action === "move") {
      action = Actions.Draw;
    } else {
      action = Actions.Move;
    }
  };

  const handleColorClick = (newColor: (typeof COLORS)[number][number]) => {
    action = Actions.Draw;
    color.set(newColor);
    colorsExpanded = false;
  };

  const handleColorKeydown = (
    e: KeyboardEvent,
    newColor: (typeof COLORS)[number][number]
  ) => {
    if (e.key === " ") {
      handleColorClick(newColor);
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (dragging) {
      position = calculateNewPosition(e.clientX, e.clientY);
    }
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (dragging) {
      position = calculateNewPosition(
        e.touches[0].clientX,
        e.touches[0].clientY
      );
    }
  };

  const handleMouseUp = () => {
    dragging = false;
  };

  const handleDragKeydown = (e: KeyboardEvent) => {
    const moveKeys = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];
    if (e.key === "Escape" || e.key === "Tab") {
      dragging = false;
    } else if (moveKeys.includes(e.key)) {
      dragging = true;
      let shift = 1;
      if (e.shiftKey) {
        shift = 10;
      }
      switch (e.key) {
        case "ArrowUp":
          position.y -= shift;
          break;
        case "ArrowDown":
          position.y += shift;
          break;
        case "ArrowLeft":
          position.x -= shift;
          break;
        case "ArrowRight":
          position.x += shift;
          break;
      }
    }
  };

  const handleColorsDropdownToggleKeydown = (e: KeyboardEvent) => {
    if (e.key === " ") {
      colorsExpanded = !colorsExpanded;
    }
  };

  const handleKeyboardShortcuts = (e: KeyboardEvent) => {
    if (e.key === "1") {
      handleEraseClick();
    } else if (e.key === "2") {
      handleMoveClick();
    } else if (e.key === "3") {
      colorsExpanded = !colorsExpanded;
    } else if (e.ctrlKey && e.key === "s") {
      e.preventDefault();
      handleSave();
    } else if (e.ctrlKey && (e.key === "Delete" || e.key === "Backspace")) {
      e.preventDefault();
      handleClearAllClick();
    }
  };
</script>

<svelte:window
  on:touchmove={handleTouchMove}
  on:mousemove={handleMouseMove}
  on:mouseup={handleMouseUp}
  on:touchend={handleMouseUp}
  on:keydown={handleKeyboardShortcuts}
/>

  <div
    role="menu"
    use:center={(pos) => (position = pos)}
    in:fly={{ y: -100 }}
    style={`left: ${position.x}px; top: ${position.y}px;`}
    class="touch-none z-10 absolute bg-dark rounded-lg dark:bg-light drop-shadow-lg p-2
	before:absolute before:top-full before:right-2 before:content-['WIP'] before:font-primary before:bg-red-500 before:text-xs before:px-1 before:rounded-b-sm"
  >
    <div class="items-center flex flex-row justify-between">
      <span
        use:focusOnMount
        role="button"
        tabindex="0"
        aria-label="Drag Toolbox"
        style="font-size: 1.75em;"
        bind:this={dragButton}
        class={`${
          dragging && "cursor-grabbing"
        }  cursor-grab flex flex-col justify-center select-none mr-4`}
        on:mousedown={() => (dragging = true)}
        on:keydown={handleDragKeydown}
        on:touchstart={() => (dragging = true)}
      >
        <DragIndicator class="fill-stone-500 h-8 w-8"
          ><Desc descKey="DESCDragToolbox"/></DragIndicator
        >
      </span>

      <div class="flex flex-row gap-x-2 justify-between pr-3">
        <ToolButton
          shortcut="Ctrl+Del"
          label="deleteAll"
          active={false}
          aria-label="Clear All"
          on:click={handleClearAllClick}
          ><Close class="h-8 w-8"><Desc descKey="DESCClearCanvas"/></Close></ToolButton
        >
        <ToolButton
          shortcut="Ctrl+S"
          label="submit"
          active={saving}
          aria-label="Save"
          disabled={saving}
          on:click={handleSave}
          ><Check class="h-8 w-8"><Desc descKey="DESCSubmitYourPainting"/></Check
          ></ToolButton
        >
      </div>

      <div
        class="flex flex-row gap-x-4 justify-between pl-3 border-l-2 border-light dark:border-dark"
      >
        <ToolButton
          shortcut="Num 1"
          label="erase"
          active={action === "erase"}
          aria-label="Toggle Erase"
          on:click={handleEraseClick}
        >
          <InkEraser class="h-8 w-8"><Desc descKey="DESCEraser"/></InkEraser>
        </ToolButton>
        <ToolButton
          shortcut="Num 2"
          label="drag"
          active={action === "move"}
          aria-label="Toggle Move"
          on:click={handleMoveClick}
          ><DragPan class="h-8 w-8"><Desc descKey="DESCMoveCanvas"/></DragPan
          ></ToolButton
        >
        <span
          aria-label="Toggle Colors Dropdown"
          tabindex="0"
          role="button"
          on:keydown={handleColorsDropdownToggleKeydown}
          on:click={() => (colorsExpanded = !colorsExpanded)}
          class="w-8 h-8 rounded-md hover:opacity-60"
          style={`background-color: ${$color.color};`}
        />
      </div>
    </div>
    {#if colorsExpanded}
      <div transition:slide class="h-[180px] overflow-y-hidden mt-4">
        <div class="flex flex-col justify-between h-[180px]">
          <div role="group" class="flex flex-row justify-between">
            {#each COLORS as subcolors}
              <div class="flex flex-col gap-y-2">
                {#each subcolors as colorObj}
                  <span
                    aria-label={`Change Color to ${colorObj.label}`}
                    tabindex="0"
                    role="button"
                    on:keydown={(e) => handleColorKeydown(e, colorObj)}
                    on:click={() => handleColorClick(colorObj)}
                    class="w-8 h-8 hover:opacity-80 rounded-full"
                    style={`background-color: ${colorObj.color};`}
                  />
                {/each}
              </div>
            {/each}
          </div>
          <div class="h-full px-2 flex flex-col justify-end gap-y-1">
            <label for="Brush Size" class="text-light dark:text-dark"
              >Brush/Eraser Size</label
            >
            <RangeInput
              aria-label="Brush Size"
              name="Brush Size"
              bind:stepIndex={brushSize}
            />
          </div>
        </div>
      </div>
    {/if}
  </div>
